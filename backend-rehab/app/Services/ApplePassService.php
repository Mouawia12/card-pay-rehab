<?php

namespace App\Services;

use App\Models\CardCustomer;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use PKPass\PKPass;
use ZipArchive;

class ApplePassService
{
    public function __construct(private readonly QrCodeService $qrCodeService)
    {
    }

    public function generate(CardCustomer $issuedCard): array
    {
        $payload = $this->payload($issuedCard);
        $assets = $this->iconSet($issuedCard);
        $fileName = $issuedCard->card_code . '.pkpass';

        $certificate = config('services.pkpass.certificate_path');
        if ($certificate && is_file($certificate)) {
            $pkPass = new PKPass($certificate, config('services.pkpass.certificate_password'));
            $pkPass->setData($payload);
            $pkPass->setName($fileName);

            foreach ($assets as $name => $binary) {
                $pkPass->addFileContent($binary, $name);
            }

            $qrBinary = $this->qrCodeService->generate($issuedCard->qr_payload, $issuedCard->customer?->name);
            $pkPass->addFileContent($qrBinary, 'strip.png');

            return [
                'binary' => $pkPass->create(),
                'filename' => $fileName,
                'signed' => true,
            ];
        }

        return $this->generateUnsignedPackage($payload, $assets, $fileName, $issuedCard);
    }

    private function payload(CardCustomer $issuedCard): array
    {
        $template = $issuedCard->card;
        $customer = $issuedCard->customer;
        $business = $template?->business;
        $businessName = $business?->name ?? 'Rehab Loyalty';

        return [
            'formatVersion' => 1,
            'serialNumber' => $issuedCard->card_code,
            'passTypeIdentifier' => config('services.pkpass.pass_type_id'),
            'teamIdentifier' => config('services.pkpass.team_id'),
            'organizationName' => config('services.pkpass.organization', $businessName),
            'description' => $template?->description ?: 'Loyalty card issued via Rehab QR',
            'logoText' => $businessName,
            'foregroundColor' => $template?->text_color ?? '#FFFFFF',
            'backgroundColor' => $template?->bg_color ?? '#000000',
            'labelColor' => '#FFFFFF',
            'relevantDate' => optional($issuedCard->issue_date)->toIso8601String(),
            'barcode' => [
                'format' => 'PKBarcodeFormatQR',
                'messageEncoding' => 'iso-8859-1',
                'message' => $issuedCard->qr_payload,
                'altText' => $issuedCard->card_code,
            ],
            'storeCard' => [
                'primaryFields' => [
                    [
                        'key' => 'customerName',
                        'label' => 'Customer',
                        'value' => $customer?->name ?? 'Guest',
                    ],
                ],
                'secondaryFields' => [
                    [
                        'key' => 'businessName',
                        'label' => 'Store',
                        'value' => $businessName,
                    ],
                ],
                'auxiliaryFields' => [
                    [
                        'key' => 'stamps',
                        'label' => 'Stamps',
                        'value' => $issuedCard->stamps_count,
                        'changeMessage' => 'Updated to %@ stamps',
                    ],
                    [
                        'key' => 'target',
                        'label' => 'Needed',
                        'value' => $issuedCard->stamps_target ?: $issuedCard->total_stages,
                    ],
                ],
                'backFields' => array_values(array_filter([
                    $template?->description ? [
                        'key' => 'description',
                        'label' => 'Details',
                        'value' => $template->description,
                    ] : null,
                    [
                        'key' => 'code',
                        'label' => 'Card Code',
                        'value' => $issuedCard->card_code,
                    ],
                ])),
            ],
        ];
    }

    private function iconSet(CardCustomer $issuedCard): array
    {
        $color = $issuedCard->card?->bg_color ?? '#0F172A';
        $text = strtoupper(Str::substr($issuedCard->customer?->name ?? 'QR', 0, 3));

        return [
            'icon.png' => $this->renderPng(120, $color, $text),
            'icon@2x.png' => $this->renderPng(240, $color, $text),
            'logo.png' => $this->renderPng(160, $color, 'VIP'),
        ];
    }

    private function renderPng(int $size, string $hexColor, string $label): string
    {
        if (!function_exists('imagecreatetruecolor')) {
            return base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAEklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==');
        }

        $image = imagecreatetruecolor($size, $size);
        [$r, $g, $b] = $this->hexToRgb($hexColor);
        $bg = imagecolorallocate($image, $r, $g, $b);
        imagefill($image, 0, 0, $bg);

        $textColor = imagecolorallocate($image, 255, 255, 255);
        imagestring($image, 5, (int) ($size / 4), (int) ($size / 2.5), $label, $textColor);

        ob_start();
        imagepng($image);
        $binary = ob_get_clean();
        imagedestroy($image);

        return $binary ?: '';
    }

    private function hexToRgb(string $hex): array
    {
        $hex = ltrim($hex, '#');
        if (strlen($hex) === 3) {
            $hex = preg_replace('/(.)/', '$1$1', $hex);
        }

        return [
            hexdec(substr($hex, 0, 2)),
            hexdec(substr($hex, 2, 2)),
            hexdec(substr($hex, 4, 2)),
        ];
    }

    private function generateUnsignedPackage(array $payload, array $assets, string $fileName, CardCustomer $issuedCard): array
    {
        $tmpPath = tempnam(sys_get_temp_dir(), 'pkpass');
        $zip = new ZipArchive();
        $zip->open($tmpPath, ZipArchive::CREATE | ZipArchive::OVERWRITE);

        $passJson = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        $zip->addFromString('pass.json', $passJson);
        $hashes = [
            'pass.json' => sha1($passJson),
        ];

        foreach ($assets as $name => $binary) {
            $zip->addFromString($name, $binary);
            $hashes[$name] = sha1($binary);
        }

        $qrBinary = $this->qrCodeService->generate($issuedCard->qr_payload, $issuedCard->customer?->name);
        $zip->addFromString('strip.png', $qrBinary);
        $hashes['strip.png'] = sha1($qrBinary);

        $manifest = json_encode($hashes, JSON_PRETTY_PRINT);
        $zip->addFromString('manifest.json', $manifest);
        $zip->addFromString('signature', 'unsigned-development-build');
        $zip->close();

        $binary = file_get_contents($tmpPath);
        @unlink($tmpPath);

        return [
            'binary' => $binary,
            'filename' => $fileName,
            'signed' => false,
        ];
    }
}
