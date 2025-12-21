<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Card;
use App\Models\CardActivation;
use App\Models\CardActivationGoogle;
use App\Models\CardCustomer;
use App\Models\Customer;
use App\Services\ApplePassService;
use App\Services\CardCodeGenerator;
use App\Services\GoogleWalletService;
use App\Services\QrCodeService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class CardInstanceController extends Controller
{
    public function __construct(
        private readonly ApplePassService $applePassService,
        private readonly GoogleWalletService $googleWalletService,
        private readonly QrCodeService $qrCodeService
    ) {
    }

    public function index(Request $request)
    {
        $businessId = $request->user()?->business_id ?? $request->query('business_id');
        $search = $request->query('q');

        $query = CardCustomer::with(['customer', 'card.business'])
            ->when($businessId, function ($q) use ($businessId) {
                $q->whereHas('card', fn ($cardQuery) => $cardQuery->where('business_id', $businessId));
            })
            ->when($search, function ($q) use ($search) {
                $q->where(function ($inner) use ($search) {
                    $inner->where('card_code', 'like', "%{$search}%")
                        ->orWhere('qr_payload', 'like', "%{$search}%")
                        ->orWhereHas('customer', fn ($customerQuery) => $customerQuery->where('name', 'like', "%{$search}%"));
                });
            })
            ->latest();

        $cards = $query->paginate($request->integer('per_page', 25));

        return response()->json([
            'data' => $cards->getCollection()->map(fn (CardCustomer $card) => $this->transform($card)),
            'meta' => [
                'current_page' => $cards->currentPage(),
                'last_page' => $cards->lastPage(),
                'per_page' => $cards->perPage(),
                'total' => $cards->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'card_template_id' => ['required', 'exists:cards,id'],
            'customer_id' => ['nullable', 'exists:customers,id'],
            'customer.name' => ['required_without:customer_id', 'string', 'max:255'],
            'customer.phone' => ['required_without:customer_id', 'string', 'max:30'],
            'customer.email' => ['nullable', 'email'],
            'issue_date' => ['nullable', 'date'],
            'expiry_date' => ['nullable', 'date', 'after_or_equal:issue_date'],
            'initial_stamps' => ['nullable', 'integer', 'min:0'],
            'notes' => ['nullable', 'string'],
        ]);

        $businessId = $request->user()?->business_id ?? $request->input('business_id');

        $template = Card::with('business')
            ->when($businessId, fn ($q) => $q->where('business_id', $businessId))
            ->findOrFail($validated['card_template_id']);

        if ($businessId && $template->business_id !== (int) $businessId) {
            return response()->json(['message' => 'لا يمكنك إصدار بطاقة من متجر آخر'], 403);
        }

        $customer = $this->resolveCustomer($validated, $template->business_id);
        $cardCode = CardCodeGenerator::make();
        $qrPayload = sprintf('%s|%s|%s', $customer->name, $template->business?->name ?? 'Merchant', $cardCode);
        $issueDate = $validated['issue_date'] ?? now();

        $issuedCard = CardCustomer::create([
            'card_id' => $template->id,
            'customer_id' => $customer->id,
            'card_code' => $cardCode,
            'qr_payload' => $qrPayload,
            'issue_date' => $issueDate,
            'expiry_date' => $validated['expiry_date'] ?? null,
            'total_stages' => $template->total_stages,
            'stamps_target' => $template->total_stages,
            'current_stage' => $validated['initial_stamps'] ?? 0,
            'stamps_count' => $validated['initial_stamps'] ?? 0,
            'status' => 'active',
            'metadata' => ['notes' => $validated['notes'] ?? null],
        ]);

        return response()->json([
            'data' => $this->transform($issuedCard->load(['card.business', 'customer'])),
        ], 201);
    }

    public function show(Request $request, CardCustomer $cardInstance)
    {
        $this->ensureBusinessAccess($request, $cardInstance);
        $cardInstance->load(['card.business', 'customer', 'activations']);
        return response()->json(['data' => $this->transform($cardInstance)]);
    }

    public function showByCode(Request $request, string $cardCode)
    {
        $card = CardCustomer::with(['card.business', 'customer', 'activations'])
            ->where('card_code', $cardCode)
            ->firstOrFail();
        $this->ensureBusinessAccess($request, $card, allowGuests: true);

        return response()->json(['data' => $this->transform($card)]);
    }

    public function qr(Request $request, string $cardCode)
    {
        $card = CardCustomer::with('card.business')->where('card_code', $cardCode)->firstOrFail();
        $this->ensureBusinessAccess($request, $card, allowGuests: true);
        $binary = $this->qrCodeService->generate($card->qr_payload, $card->customer?->name);

        return new Response($binary, 200, [
            'Content-Type' => 'image/png',
            'Content-Disposition' => 'inline; filename="' . $card->card_code . '.png"',
        ]);
    }

    public function googleWallet(Request $request, string $cardCode)
    {
        if (! config('services.google_wallet.enabled')) {
            abort(404, 'Google Wallet غير مدعوم');
        }

        $card = CardCustomer::with(['card.business', 'customer'])->where('card_code', $cardCode)->firstOrFail();
        $this->ensureBusinessAccess($request, $card, allowGuests: true);

        $result = $this->googleWalletService->generate($card);

        CardActivationGoogle::create([
            'card_customer_id' => $card->id,
            'device_type' => $request->header('User-Agent'),
            'device_identifier' => Str::uuid()->toString(),
            'wallet_type' => 'google',
            'metadata' => [
                'class_id' => $result['class_id'],
                'object_id' => $result['object_id'],
                'origin' => $request->header('Origin') ?? $request->header('Referer'),
            ],
            'activated_at' => now(),
        ]);

        $card->update([
            'google_object_id' => $result['object_id'],
            'google_class_id' => $result['class_id'],
            'last_google_update' => now(),
        ]);

        return response()->json([
            'data' => [
                'save_url' => $result['save_url'],
                'jwt' => $result['jwt'],
                'class_id' => $result['class_id'],
                'object_id' => $result['object_id'],
                'last_google_update' => optional($card->last_google_update)->toIso8601String(),
            ],
        ]);
    }

    public function pkpass(Request $request, string $cardCode)
    {
        $card = CardCustomer::with(['card.business', 'customer'])->where('card_code', $cardCode)->firstOrFail();
        $this->ensureBusinessAccess($request, $card, allowGuests: true);
        $result = $this->applePassService->generate($card);

        CardActivation::create([
            'card_id' => $card->card_id,
            'card_customer_id' => $card->id,
            'customer_id' => $card->customer_id,
            'business_id' => $card->card?->business_id ?? $request->user()?->business_id,
            'channel' => 'pkpass',
            'device_type' => $request->header('User-Agent'),
            'device_identifier' => Str::uuid()->toString(),
            'metadata' => [
                'signed' => $result['signed'],
                'downloaded_by' => $request->user()?->id,
            ],
            'activated_at' => now(),
        ]);

        $card->update(['apple_wallet_installed_at' => now()]);

        return new Response($result['binary'], 200, [
            'Content-Type' => 'application/vnd.apple.pkpass',
            'Content-Disposition' => 'attachment; filename="' . $result['filename'] . '"',
        ]);
    }

    public function googleWalletRefresh(Request $request, string $cardCode)
    {
        if (! config('services.google_wallet.enabled')) {
            abort(404, 'Google Wallet غير مدعوم');
        }

        $card = CardCustomer::with(['card.business', 'customer'])->where('card_code', $cardCode)->firstOrFail();
        $this->ensureBusinessAccess($request, $card, allowGuests: true);

        if (! $card->google_object_id) {
            return response()->json(['message' => 'Google Wallet object غير موجود لهذه البطاقة'], 422);
        }

        $payload = [
            'loyaltyPoints' => [
                'label' => 'Points',
                'balance' => ['string' => (string) $card->stamps_count],
            ],
            'infoModuleData' => [
                'labelValueRows' => [
                    [
                        'columns' => [
                            ['label' => 'Stamps', 'value' => (string) $card->stamps_count],
                            ['label' => 'Target', 'value' => (string) ($card->stamps_target ?: $card->total_stages ?: 0)],
                        ],
                    ],
                ],
            ],
        ];

        $this->googleWalletService->updateLoyaltyObject($card->google_object_id, $payload);
        $card->update(['last_google_update' => now()]);

        return response()->json(['data' => [
            'object_id' => $card->google_object_id,
            'last_google_update' => optional($card->last_google_update)->toIso8601String(),
        ]]);
    }

    public function reissueGoogleWallet(Request $request, CardCustomer $cardInstance)
    {
        if (! config('services.google_wallet.enabled')) {
            abort(404, 'Google Wallet غير مدعوم');
        }

        $cardInstance->load(['card.business', 'customer']);
        $this->ensureBusinessAccess($request, $cardInstance);

        try {
            $result = $this->googleWalletService->generate($cardInstance);
        } catch (\Throwable $e) {
            report($e);
            return response()->json(['message' => 'تعذر إعادة إصدار بطاقة Google Wallet'], 422);
        }

        CardActivationGoogle::create([
            'card_customer_id' => $cardInstance->id,
            'device_type' => $request->header('User-Agent'),
            'device_identifier' => Str::uuid()->toString(),
            'wallet_type' => 'google',
            'metadata' => [
                'reissued_by' => $request->user()?->id,
                'origin' => $request->header('Origin') ?? $request->header('Referer'),
            ],
            'activated_at' => now(),
        ]);

        $cardInstance->update([
            'google_object_id' => $result['object_id'],
            'google_class_id' => $result['class_id'],
            'last_google_update' => now(),
        ]);

        return response()->json([
            'data' => [
                'save_url' => $result['save_url'],
                'jwt' => $result['jwt'],
                'class_id' => $result['class_id'],
                'object_id' => $result['object_id'],
                'last_google_update' => optional($cardInstance->last_google_update)->toIso8601String(),
            ],
        ]);
    }

    private function resolveCustomer(array $validated, int $businessId): Customer
    {
        if (!empty($validated['customer_id'])) {
            return Customer::where('business_id', $businessId)
                ->findOrFail($validated['customer_id']);
        }

        $payload = Arr::get($validated, 'customer');

        return Customer::firstOrCreate(
            [
                'business_id' => $businessId,
                'phone' => $payload['phone'],
            ],
            [
                'name' => $payload['name'],
                'email' => $payload['email'] ?? null,
                'language' => 'ar',
            ]
        );
    }

    private function transform(CardCustomer $card): array
    {
        $card->loadMissing(['customer', 'card.business', 'activations', 'googleActivations']);
        $businessName = $card->card?->business?->name;
        $lastGoogleActivation = $card->googleActivations->sortByDesc('activated_at')->first();
        $googleWalletEnabled = config('services.google_wallet.enabled');

        return [
            'id' => $card->id,
            'card_code' => $card->card_code,
            'qr_payload' => $card->qr_payload,
            'issue_date' => optional($card->issue_date)->toDateString(),
            'expiry_date' => optional($card->expiry_date)->toDateString(),
            'stamps_count' => $card->stamps_count,
            'stamps_target' => $card->stamps_target ?: $card->total_stages,
            'status' => $card->status,
            'apple_wallet_installed_at' => optional($card->apple_wallet_installed_at)->toIso8601String(),
            'last_scanned_at' => optional($card->last_scanned_at)->toIso8601String(),
            'customer' => $card->customer?->only(['id', 'name', 'phone', 'email']),
            'template' => array_merge(
                $card->card?->only(['id', 'name', 'title', 'bg_color', 'text_color']) ?? [],
                ['business' => $businessName]
            ),
            'qr_url' => route('card-instances.qr', ['card_code' => $card->card_code]),
            'pkpass_url' => route('card-instances.pkpass', ['card_code' => $card->card_code]),
            'google_wallet' => $googleWalletEnabled ? [
                'url' => route('card-instances.google-wallet', ['card_code' => $card->card_code]),
                'installed_at' => optional($lastGoogleActivation?->activated_at)->toIso8601String(),
                'activation_count' => $card->googleActivations->count(),
                'object_id' => $card->google_object_id,
                'class_id' => $card->google_class_id,
                'last_update' => optional($card->last_google_update)->toIso8601String(),
            ] : null,
            'activations' => $card->activations->map(fn ($activation) => [
                'id' => $activation->id,
                'channel' => $activation->channel,
                'device_type' => $activation->device_type,
                'activated_at' => optional($activation->activated_at)->toIso8601String(),
            ]),
        ];
    }

    private function ensureBusinessAccess(Request $request, CardCustomer $card, bool $allowGuests = false): void
    {
        if ($allowGuests && ! $request->user()) {
            return;
        }

        $businessId = $request->user()?->business_id;
        if (! $businessId) {
            return;
        }

        if ($card->card?->business_id && $card->card->business_id !== $businessId) {
            abort(403, 'لا يمكنك الوصول إلى هذه البطاقة');
        }
    }
}
