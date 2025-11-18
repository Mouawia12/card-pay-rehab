<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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

        $transactions = Transaction::with(['customer', 'card', 'product'])
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
            'note' => ['nullable', 'string'],
            'happened_at' => ['nullable', 'date'],
        ]);

        $businessId = $request->user()?->business_id ?? $request->input('business_id');

        $transaction = Transaction::create([
            ...$validated,
            'business_id' => $businessId,
            'currency' => $validated['currency'] ?? 'SAR',
        ]);

        return response()->json(['data' => $transaction], 201);
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
