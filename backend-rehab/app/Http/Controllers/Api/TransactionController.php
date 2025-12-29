<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Card;
use App\Models\CardCustomer;
use App\Models\Customer;
use App\Models\Transaction;
use App\Services\GoogleWalletService;
use App\Services\QrPayloadService;
use App\Services\WebPushService;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function __construct(
        private readonly GoogleWalletService $googleWalletService,
        private readonly QrPayloadService $qrPayloadService,
        private readonly WebPushService $webPushService
    )
    {
    }

    /**
     * Explicit scan endpoint: only needs card_code and fills defaults.
     */
    public function scan(Request $request)
    {
        $request->headers->set('Accept', 'application/json');

        $validated = $request->validate([
            'card_code' => ['required', 'string', 'exists:card_customers,card_code'],
            'expires_at' => ['required', 'integer'],
            'signature' => ['required', 'string'],
        ]);

        if (! $this->qrPayloadService->verify($validated['card_code'], (int) $validated['expires_at'], $validated['signature'])) {
            return response()->json([
                'message' => 'رمز المسح غير صالح أو منتهي الصلاحية.',
            ], 422);
        }

        $payload = array_merge([
            'type' => 'scan',
            'amount' => 0,
        ], array_diff_key($validated, array_flip(['expires_at', 'signature'])));

        return $this->processTransaction($request, $payload);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $businessId = $request->user()?->business_id;
        if (! $businessId) {
            abort(403, 'غير مصرح');
        }

        $transactions = Transaction::with(['customer', 'card', 'product', 'scanner'])
            ->when($businessId, fn ($q) => $q->where('business_id', $businessId))
            ->orderByDesc('happened_at')
            ->limit(100)
            ->get()
            ->map(function (Transaction $transaction) {
                return [
                    'id' => $transaction->id,
                    'type' => $transaction->type,
                    'amount' => $transaction->amount,
                    'currency' => $transaction->currency,
                    'note' => $transaction->note,
                    'reference' => $transaction->reference,
                    'happened_at' => optional($transaction->happened_at)->toIso8601String(),
                    'customer' => $transaction->customer?->only(['id', 'name', 'phone']),
                    'card' => $transaction->card?->only(['id', 'name', 'card_code']),
                    'product' => $transaction->product?->only(['id', 'name', 'sku']),
                    'scanner' => $transaction->scanner?->only(['id', 'name', 'role']),
                ];
            });

        return response()->json(['data' => $transactions]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'card_id' => ['nullable', 'exists:cards,id'],
            'customer_id' => ['nullable', 'exists:customers,id'],
            'product_id' => ['nullable', 'exists:products,id'],
            'type' => ['required', 'string'],
            'amount' => ['required', 'numeric'],
            'currency' => ['nullable', 'string', 'max:5'],
            'reference' => ['nullable', 'string', 'max:100'],
            'card_code' => ['nullable', 'string', 'max:255'],
            'note' => ['nullable', 'string'],
            'happened_at' => ['nullable', 'date'],
            'stamps_awarded' => ['nullable', 'integer', 'min:1'],
        ]);

        return $this->processTransaction($request, $validated);
    }

    private function processTransaction(Request $request, array $validated)
    {
        $businessId = $request->user()?->business_id;
        if (! $businessId) {
            abort(403, 'غير مصرح');
        }
        $card = null;
        $customer = null;

        if ($request->filled('card_id')) {
            $card = Card::find($validated['card_id']);
        }

        $issuedCard = null;
        $googleWalletStatus = null;

        if ($request->filled('card_code')) {
            $issuedCard = CardCustomer::with(['card', 'customer'])->where('card_code', $request->string('card_code'))->first();
            if (! $issuedCard) {
                return response()->json([
                    'message' => 'رقم البطاقة غير معروف. تأكد من استخدام رمز QR الصحيح.',
                ], 422);
            }

            $card = $issuedCard->card;
            $customer = $issuedCard->customer;
            $validated['card_id'] = $card?->id;
            $validated['customer_id'] = $customer?->id;
            $validated['reference'] = $validated['reference'] ?? $issuedCard->card_code;
            if ($card?->business_id && $card->business_id !== $businessId) {
                abort(403, 'غير مصرح');
            }
        }

        if (! $issuedCard && $request->filled('card_id')) {
            $card = Card::find($validated['card_id']);
            if ($card) {
                if ($card->business_id !== $businessId) {
                    abort(403, 'غير مصرح');
                }
                $issuedCard = CardCustomer::where('card_id', $card->id)
                    ->when($request->filled('customer_id'), fn ($q) => $q->where('customer_id', $validated['customer_id']))
                    ->latest('issue_date')
                    ->first();
                $customer = $issuedCard?->customer ?? ($request->filled('customer_id') ? Customer::find($validated['customer_id']) : null);
            }
        }

        $transaction = Transaction::create([
            ...$validated,
            'business_id' => $businessId,
            'currency' => $validated['currency'] ?? 'SAR',
            'scanned_by' => $request->user()?->id,
            'metadata' => [
                'card_customer_id' => $issuedCard?->id,
                'stamps_awarded' => $request->input('stamps_awarded', 1),
            ],
        ]);

        $googleWalletStatus = [
            'status' => 'skipped',
            'message' => 'لا يوجد Google Wallet مفعّل لهذه البطاقة',
            'object_id' => $issuedCard?->google_object_id,
            'save_url' => null,
            'last_google_update' => null,
        ];

        if ($issuedCard) {
            $increment = max(1, (int) $request->input('stamps_awarded', 1));
            $issuedCard->stamps_count += $increment;
            $issuedCard->current_stage = min($issuedCard->total_stages, $issuedCard->current_stage + $increment);
            if ($issuedCard->current_stage >= $issuedCard->total_stages && $issuedCard->total_stages > 0) {
                $issuedCard->available_rewards += 1;
                $issuedCard->current_stage = 0;
            }
            $issuedCard->last_scanned_at = now();
            $issuedCard->save();

            if ($issuedCard->google_object_id) {
                try {
                    $updated = $this->googleWalletService->updateLoyaltyObject($issuedCard->google_object_id, [
                        'loyaltyPoints' => [
                            'label' => 'Points',
                            'balance' => ['string' => (string) $issuedCard->stamps_count],
                        ],
                        'infoModuleData' => [
                            'labelValueRows' => [
                                [
                                    'columns' => [
                                        ['label' => 'Stamps', 'value' => (string) $issuedCard->stamps_count],
                                        ['label' => 'Target', 'value' => (string) ($issuedCard->stamps_target ?: $issuedCard->total_stages ?: 0)],
                                    ],
                                ],
                            ],
                        ],
                    ]);
                    if ($updated) {
                        $issuedCard->update(['last_google_update' => now()]);
                        $googleWalletStatus = [
                            'status' => 'success',
                            'object_id' => $issuedCard->google_object_id,
                            'last_google_update' => optional($issuedCard->last_google_update)->toIso8601String(),
                            'save_url' => null,
                        ];
                    } else {
                        $googleWalletStatus = [
                            'status' => 'skipped',
                            'message' => 'تكامل Google Wallet غير مفعّل',
                            'object_id' => $issuedCard->google_object_id,
                            'save_url' => null,
                            'last_google_update' => optional($issuedCard->last_google_update)->toIso8601String(),
                        ];
                    }
                } catch (\Throwable $e) {
                    report($e);
                    $googleWalletStatus = [
                        'status' => 'error',
                        'message' => 'تعذر تحديث Google Wallet',
                        'object_id' => $issuedCard->google_object_id,
                        'save_url' => null,
                        'last_google_update' => optional($issuedCard->last_google_update)->toIso8601String(),
                    ];
                }
            }
        }

        if ($customer) {
            $customer->update(['last_visit_at' => now()]);
        }

        if ($issuedCard) {
            $target = $issuedCard->stamps_target ?: $issuedCard->total_stages ?: 0;
            $payload = [
                'title' => '🎉 تمت إضافة نقاط جديدة',
                'body' => sprintf('رصيدك الآن: %s / %s', $issuedCard->stamps_count, $target),
                'data' => [
                    'type' => 'points_update',
                    'card_code' => $issuedCard->card_code,
                    'url' => rtrim(config('app.frontend_url', config('app.url')), '/') . '/card?card=' . $issuedCard->card_code,
                ],
            ];

            try {
                $this->webPushService->sendToCard($issuedCard, $payload);
            } catch (\Throwable $e) {
                report($e);
            }
        }

        $transaction->load(['customer', 'card', 'product', 'scanner']);

        return response()->json([
            'data' => [
                'id' => $transaction->id,
                'type' => $transaction->type,
                'amount' => $transaction->amount,
                'currency' => $transaction->currency,
                'note' => $transaction->note,
                'reference' => $transaction->reference,
                'happened_at' => optional($transaction->happened_at)->toIso8601String(),
                'customer' => $transaction->customer?->only(['id', 'name', 'phone']),
                'card' => $transaction->card?->only(['id', 'name', 'card_code']),
                'product' => $transaction->product?->only(['id', 'name', 'sku']),
                'scanner' => $transaction->scanner?->only(['id', 'name', 'role']),
            ],
            'google_wallet' => $googleWalletStatus,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $transaction = Transaction::with(['customer', 'card', 'product'])->findOrFail($id);
        $this->ensureBusinessAccess(request(), $transaction);

        return response()->json(['data' => $transaction]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $transaction = Transaction::findOrFail($id);
        $this->ensureBusinessAccess($request, $transaction);

        $validated = $request->validate([
            'type' => ['sometimes', 'string'],
            'amount' => ['sometimes', 'numeric'],
            'currency' => ['nullable', 'string', 'max:5'],
            'reference' => ['nullable', 'string', 'max:100'],
            'note' => ['nullable', 'string'],
            'happened_at' => ['nullable', 'date'],
        ]);

        $transaction->update($validated);

        return response()->json(['data' => $transaction]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $transaction = Transaction::findOrFail($id);
        $this->ensureBusinessAccess(request(), $transaction);
        $transaction->delete();

        return response()->json(['message' => 'تم حذف السجل']);
    }

    private function ensureBusinessAccess(Request $request, Transaction $transaction): void
    {
        $businessId = $request->user()?->business_id;
        if (! $businessId || $transaction->business_id !== $businessId) {
            abort(403, 'غير مصرح');
        }
    }
}
