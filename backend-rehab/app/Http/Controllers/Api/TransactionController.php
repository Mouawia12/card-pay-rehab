<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Card;
use App\Models\CardCustomer;
use App\Models\Customer;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
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
        ]);

        $businessId = $request->user()?->business_id ?? $request->input('business_id');
        $card = null;
        $customer = null;

        if ($request->filled('card_id')) {
            $card = Card::find($validated['card_id']);
        }

        if (! $card && $request->filled('card_code')) {
            $card = Card::where('card_code', $request->input('card_code'))->first();
            if (! $card) {
                return response()->json([
                    'message' => 'البطاقة غير معروفة. يرجى إنشاء البطاقة أو التأكد من رمز QR.',
                ], 422);
            }
        }

        if (! $card && $request->filled('reference')) {
            $card = Card::where('card_code', $request->input('reference'))->first();
        }

        $cardCustomer = null;

        if ($card) {
            $businessId = $businessId ?: $card->business_id;
            if (! $request->filled('customer_id')) {
                $cardCustomer = CardCustomer::where('card_id', $card->id)
                    ->latest('issue_date')
                    ->first();
                $customer = $cardCustomer?->customer;
                if ($customer) {
                    $validated['customer_id'] = $customer->id;
                }
            } else {
                $customer = Customer::find($validated['customer_id']);
                if ($customer) {
                    $cardCustomer = CardCustomer::where('card_id', $card->id)
                        ->where('customer_id', $customer->id)
                        ->first();
                }
            }

            $validated['card_id'] = $card->id;
            $validated['reference'] = $validated['reference'] ?? $card->card_code;
        } elseif (! $businessId) {
            $businessId = $request->user()?->business_id;
        }

        $transaction = Transaction::create([
            ...$validated,
            'business_id' => $businessId,
            'currency' => $validated['currency'] ?? 'SAR',
            'scanned_by' => $request->user()?->id,
        ]);

        if ($card && $customer && ! $cardCustomer) {
            $cardCustomer = CardCustomer::create([
                'card_id' => $card->id,
                'customer_id' => $customer->id,
                'issue_date' => now(),
                'total_stages' => $card->total_stages,
                'current_stage' => 0,
                'status' => 'active',
            ]);
        }

        if ($cardCustomer) {
            $cardCustomer->current_stage = min(
                $cardCustomer->total_stages,
                $cardCustomer->current_stage + 1
            );
            if ($cardCustomer->current_stage >= $cardCustomer->total_stages && $cardCustomer->total_stages > 0) {
                $cardCustomer->available_rewards += 1;
                $cardCustomer->current_stage = 0;
            }
            $cardCustomer->save();
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
