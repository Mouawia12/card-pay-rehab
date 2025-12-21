<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Card;
use App\Models\CardCustomer;
use App\Models\Customer;
use App\Services\CardCodeGenerator;
use App\Services\GoogleWalletService;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class PublicCardRegistrationController extends Controller
{
    public function __construct(
        private readonly GoogleWalletService $googleWalletService
    ) {
    }

    public function show(string $cardCode)
    {
        $card = Card::where('card_code', $cardCode)->firstOrFail();
        $settings = $card->settings ?? [];
        $formFields = Arr::get($settings, 'formFields', []);

        return response()->json([
            'data' => [
                'id' => $card->id,
                'card_code' => $card->card_code,
                'name' => $card->name,
                'title' => $card->title,
                'description' => $card->description,
                'total_stages' => $card->total_stages,
                'bg_color' => $card->bg_color,
                'text_color' => $card->text_color,
                'form_fields' => $formFields,
                'registration_url' => $this->registrationUrl($card),
            ],
        ]);
    }

    public function register(Request $request, string $cardCode)
    {
        $card = Card::with('business')->where('card_code', $cardCode)->firstOrFail();
        $settings = $card->settings ?? [];

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'email' => ['nullable', 'email'],
        ]);

        $customer = Customer::firstOrCreate(
            [
                'business_id' => $card->business_id,
                'phone' => $validated['phone'],
            ],
            [
                'name' => $validated['name'],
                'email' => $validated['email'] ?? null,
                'language' => 'ar',
            ]
        );

        $issued = CardCustomer::where('card_id', $card->id)
            ->where('customer_id', $customer->id)
            ->first();

        $created = false;
        if ($issued) {
            $cardCodeInstance = $issued->card_code ?: CardCodeGenerator::make();
            $qrPayload = $issued->qr_payload ?: sprintf(
                '%s|%s|%s',
                $customer->name,
                $card->business?->name ?? 'Merchant',
                $cardCodeInstance
            );

            $issued->fill([
                'card_code' => $cardCodeInstance,
                'qr_payload' => $qrPayload,
                'issue_date' => $issued->issue_date ?? now(),
                'expiry_date' => $issued->expiry_date,
                'total_stages' => $issued->total_stages ?: $card->total_stages,
                'stamps_target' => $issued->stamps_target ?: $card->total_stages,
                'status' => $issued->status ?: 'active',
                'metadata' => array_merge((array) $issued->metadata, ['registration_source' => 'public_qr']),
            ]);
            $issued->save();
        } else {
            $created = true;
            $cardCodeInstance = CardCodeGenerator::make();
            $qrPayload = sprintf('%s|%s|%s', $customer->name, $card->business?->name ?? 'Merchant', $cardCodeInstance);

            $issued = CardCustomer::create([
                'card_id' => $card->id,
                'customer_id' => $customer->id,
                'card_code' => $cardCodeInstance,
                'qr_payload' => $qrPayload,
                'issue_date' => now(),
                'expiry_date' => null,
                'total_stages' => $card->total_stages,
                'stamps_target' => $card->total_stages,
                'current_stage' => 0,
                'stamps_count' => 0,
                'status' => 'active',
                'metadata' => ['registration_source' => 'public_qr'],
            ]);
        }

        $google = null;
        if (config('services.google_wallet.enabled') && ! $issued->google_object_id) {
            try {
                $google = $this->googleWalletService->generate($issued);
                $issued->update([
                    'google_object_id' => $google['object_id'] ?? null,
                    'google_class_id' => $google['class_id'] ?? null,
                    'last_google_update' => now(),
                ]);
            } catch (\Throwable $e) {
                // Allow registration even if Google Wallet is not configured
                report($e);
            }
        }

        // Apple pass is generated lazily via download route; expose link
        $pkpassUrl = route('card-instances.pkpass', ['card_code' => $issued->card_code]);
        $googleWalletUrl = config('services.google_wallet.enabled') ? ($google['save_url'] ?? null) : null;

        return response()->json([
            'data' => [
                'card_instance' => [
                    'id' => $issued->id,
                    'card_code' => $issued->card_code,
                    'qr_payload' => $issued->qr_payload,
                    'qr_url' => route('card-instances.qr', ['card_code' => $issued->card_code]),
                    'pkpass_url' => $pkpassUrl,
                    'google_wallet_url' => $googleWalletUrl,
                    'google_object_id' => $googleWalletUrl ? ($google['object_id'] ?? null) : null,
                    'google_class_id' => $googleWalletUrl ? ($google['class_id'] ?? null) : null,
                ],
                'registration_url' => $this->registrationUrl($card),
            ],
        ], $created ? 201 : 200);
    }

    private function registrationUrl(Card $card): string
    {
        $base = rtrim(config('app.frontend_url', config('app.url')), '/');
        return $base . '/new-customer?card=' . $card->card_code;
    }
}
