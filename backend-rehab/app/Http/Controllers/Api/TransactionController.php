<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Card;
use App\Models\CardCustomer;
use App\Models\Customer;
use App\Models\Transaction;
use App\Services\GoogleWalletService;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function __construct(private readonly GoogleWalletService $googleWalletService)
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $businessId = $request->user()?->business_id ?? $request->query('business_id');

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

        $businessId = $request->user()?->business_id ?? $request->input('business_id');
        $card = null;
        $customer = null;

        if ($request->filled('card_id')) {
            $card = Card::find($validated['card_id']);
        }

        $issuedCard = null;

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
            $businessId = $businessId ?: $card?->business_id;
        }

        if (! $issuedCard && $request->filled('card_id')) {
            $card = Card::find($validated['card_id']);
            if ($card) {
                $businessId = $businessId ?: $card->business_id;
                $issuedCard = CardCustomer::where('card_id', $card->id)
                    ->when($request->filled('customer_id'), fn ($q) => $q->where('customer_id', $validated['customer_id']))
                    ->latest('issue_date')
                    ->first();
                $customer = $issuedCard?->customer ?? ($request->filled('customer_id') ? Customer::find($validated['customer_id']) : null);
            }
        }

        if (! $businessId) {
            $businessId = $request->user()?->business_id;
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
                    $this->googleWalletService->updateLoyaltyObject($issuedCard->google_object_id, [
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
                    $issuedCard->update(['last_google_update' => now()]);
                } catch (\Throwable $e) {
                    report($e);
                }
            }
        }

        if ($customer) {
            $customer->update(['last_visit_at' => now()]);
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
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $transaction = Transaction::with(['customer', 'card', 'product'])->findOrFail($id);

        return response()->json(['data' => $transaction]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $transaction = Transaction::findOrFail($id);

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
        $transaction->delete();

        return response()->json(['message' => 'تم حذف السجل']);
    }
}
