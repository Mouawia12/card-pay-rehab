<?php

namespace App\Services;

use App\Models\CardCustomer;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use RuntimeException;

class GoogleWalletService
{
    private const GOOGLE_AUD = 'google';
    private const TOKEN_SCOPE = 'https://www.googleapis.com/auth/wallet_object.issuer';
    private const BASE_URL = 'https://walletobjects.googleapis.com/walletobjects/v1';

    public function generate(CardCustomer $card): array
    {
        $config = config('services.google_wallet');
        if (empty($config['enabled'])) {
            throw new RuntimeException('Google Wallet integration is disabled.');
        }

        $issuerId = $config['issuer_id'];
        if (!$issuerId) {
            throw new RuntimeException('Missing GOOGLE_WALLET_ISSUER_ID in configuration.');
        }

        $credentials = $this->credentials(Arr::get($config, 'service_account_json'));
        $accessToken = $this->fetchAccessToken($credentials);

        $classId = $this->buildClassId($issuerId, $config['class_id_prefix'] ?? 'rehab', $card);
        $objectId = $this->buildObjectId($issuerId, $card->card_code);

        $this->ensureLoyaltyClass($classId, $card, $accessToken);
        $this->ensureLoyaltyObject($objectId, $classId, $card, $accessToken);

        $jwt = $this->buildSaveJwt(
            $credentials,
            $classId,
            $objectId,
            Arr::get($config, 'origin', config('app.url'))
        );

        return [
            'jwt' => $jwt,
            'save_url' => 'https://pay.google.com/gp/v/save/' . $jwt,
            'class_id' => $classId,
            'object_id' => $objectId,
        ];
    }

    public function updateLoyaltyObject(string $objectId, array $payload): bool
    {
        $config = config('services.google_wallet');
        if (empty($config['enabled'])) {
            return false;
        }

        $credentials = $this->credentials(Arr::get($config, 'service_account_json'));
        $accessToken = $this->fetchAccessToken($credentials);
        $url = self::BASE_URL . '/loyaltyObject/' . rawurlencode($objectId);

        $response = Http::withToken($accessToken)->patch($url, $payload);

        if ($response->successful()) {
            return true;
        }

        // Retry with PUT upsert semantics if PATCH failed due to missing object
        if (in_array($response->status(), [404, 400], true)) {
            $putResponse = Http::withToken($accessToken)->put($url, $payload);
            if ($putResponse->successful()) {
                return true;
            }
        }

        throw new RuntimeException('Failed to update Google Wallet object: ' . $response->body());
    }

    private function credentials(?string $serviceAccountJson): array
    {
        if (!$serviceAccountJson) {
            throw new RuntimeException('Missing GOOGLE_WALLET_SERVICE_ACCOUNT configuration.');
        }

        $raw = $serviceAccountJson;
        if (is_file($serviceAccountJson)) {
            $raw = file_get_contents($serviceAccountJson);
        } elseif ($this->looksLikeBase64($serviceAccountJson)) {
            $decoded = base64_decode($serviceAccountJson, true);
            if ($decoded !== false) {
                $raw = $decoded;
            }
        }

        $data = json_decode((string) $raw, true);
        if (!is_array($data) || empty($data['private_key']) || empty($data['client_email'])) {
            throw new RuntimeException('Invalid Google service account JSON.');
        }

        return $data;
    }

    private function fetchAccessToken(array $credentials): string
    {
        $tokenUri = $credentials['token_uri'] ?? 'https://oauth2.googleapis.com/token';
        $now = time();
        $assertion = $this->signJwt([
            'iss' => $credentials['client_email'],
            'scope' => self::TOKEN_SCOPE,
            'aud' => $tokenUri,
            'iat' => $now,
            'exp' => $now + 3600,
        ], $credentials['private_key']);

        $response = Http::asForm()->post($tokenUri, [
            'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            'assertion' => $assertion,
        ]);

        if (!$response->successful()) {
            throw new RuntimeException('Unable to fetch Google access token: ' . $response->body());
        }

        return $response->json('access_token');
    }

    private function ensureLoyaltyClass(string $classId, CardCustomer $card, string $accessToken): void
    {
        $classUrl = self::BASE_URL . '/loyaltyClass/' . rawurlencode($classId);

        $existing = Http::withToken($accessToken)->get($classUrl);
        if ($existing->successful()) {
            return;
        }

        if ($existing->status() !== 404 && $existing->status() !== 403) {
            throw new RuntimeException('Unable to verify Google Wallet class: ' . $existing->body());
        }

        $businessName = $card->card?->business?->name ?? 'Rehab Loyalty';
        $create = Http::withToken($accessToken)->post(self::BASE_URL . '/loyaltyClass', [
            'id' => $classId,
            'issuerName' => $businessName,
            'programName' => $card->card?->name ?? 'Loyalty Program',
            'reviewStatus' => 'UNDER_REVIEW',
            'countryCode' => 'SA',
            'textModulesData' => [
                [
                    'header' => 'Store',
                    'body' => $businessName,
                ],
            ],
        ]);

        if (!$create->successful() && $create->status() !== 409) {
            throw new RuntimeException('Unable to create Google Wallet class: ' . $create->body());
        }
    }

    private function ensureLoyaltyObject(string $objectId, string $classId, CardCustomer $card, string $accessToken): void
    {
        $objectUrl = self::BASE_URL . '/loyaltyObject/' . rawurlencode($objectId);
        $existing = Http::withToken($accessToken)->get($objectUrl);
        if ($existing->successful()) {
            return;
        }

        if ($existing->status() !== 404 && $existing->status() !== 403) {
            throw new RuntimeException('Unable to verify Google Wallet object: ' . $existing->body());
        }

        $businessName = $card->card?->business?->name ?? 'Rehab Loyalty';
        $payload = [
            'id' => $objectId,
            'classId' => $classId,
            'state' => 'ACTIVE',
            'accountId' => $card->card_code,
            'accountName' => $card->customer?->name ?? 'Customer',
            'barcode' => [
                'type' => 'QR_CODE',
                'value' => $card->qr_payload,
                'alternateText' => $card->card_code,
            ],
            'loyaltyPoints' => [
                'label' => 'Stamps',
                'balance' => [
                    'string' => (string) ($card->stamps_count ?? 0),
                ],
            ],
            'infoModuleData' => [
                'labelValueRows' => [
                    [
                        'columns' => [
                            [
                                'label' => 'Stamps',
                                'value' => (string) ($card->stamps_count ?? 0),
                            ],
                            [
                                'label' => 'Target',
                                'value' => (string) ($card->stamps_target ?: $card->total_stages ?: 0),
                            ],
                        ],
                    ],
                ],
            ],
            'textModulesData' => array_values(array_filter([
                [
                    'header' => 'Store',
                    'body' => $businessName,
                ],
                $card->card?->description ? [
                    'header' => 'Details',
                    'body' => $card->card->description,
                ] : null,
            ])),
        ];

        $create = Http::withToken($accessToken)->post(self::BASE_URL . '/loyaltyObject', $payload);
        if (!$create->successful() && $create->status() !== 409) {
            throw new RuntimeException('Unable to create Google Wallet object: ' . $create->body());
        }
    }

    private function buildSaveJwt(array $credentials, string $classId, string $objectId, ?string $origin = null): string
    {
        $now = time();

        $payload = [
            'iss' => $credentials['client_email'],
            'aud' => self::GOOGLE_AUD,
            'typ' => 'savetowallet',
            'iat' => $now,
            'exp' => $now + 3600,
            'origins' => array_values(array_filter([$origin ?? config('app.url')])),
            'payload' => [
                'loyaltyClasses' => [
                    ['id' => $classId],
                ],
                'loyaltyObjects' => [
                    ['id' => $objectId],
                ],
            ],
        ];

        return $this->signJwt($payload, $credentials['private_key']);
    }

    private function signJwt(array $payload, string $privateKey): string
    {
        $header = ['alg' => 'RS256', 'typ' => 'JWT'];
        $segments = [
            $this->base64UrlEncode(json_encode($header, JSON_UNESCAPED_SLASHES)),
            $this->base64UrlEncode(json_encode($payload, JSON_UNESCAPED_SLASHES)),
        ];

        $input = implode('.', $segments);
        $signature = '';
        $success = openssl_sign($input, $signature, $privateKey, 'sha256WithRSAEncryption');
        if (!$success) {
            throw new RuntimeException('Failed to sign Google Wallet JWT.');
        }

        return $input . '.' . $this->base64UrlEncode($signature);
    }

    private function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private function looksLikeBase64(string $value): bool
    {
        return strlen($value) % 4 === 0 && preg_match('/^[A-Za-z0-9+\\/\\n=]+$/', $value) === 1;
    }

    private function buildClassId(string $issuerId, string $prefix, CardCustomer $card): string
    {
        $suffix = $this->sanitizeId($prefix . '_' . ($card->card?->id ?? 'class') . '_' . ($card->card_code ?? Str::random(6)));
        return $issuerId . '.' . $suffix;
    }

    private function buildObjectId(string $issuerId, string $cardCode): string
    {
        $suffix = $this->sanitizeId($cardCode);
        return $issuerId . '.' . $suffix;
    }

    private function sanitizeId(string $value): string
    {
        $normalized = preg_replace('/[^A-Za-z0-9._-]/', '_', $value);
        $normalized = trim($normalized ?? '', '._-');

        if ($normalized === '') {
            $normalized = Str::random(8);
        }

        return $normalized;
    }
}
