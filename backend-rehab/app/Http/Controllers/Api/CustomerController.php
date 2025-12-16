<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $businessId = $request->user()?->business_id ?? $request->query('business_id');

        $customers = Customer::with('cardCustomers.card')
            ->withCount(['cardCustomers as active_cards'])
            ->when($businessId, fn ($q) => $q->where('business_id', $businessId))
            ->orderByDesc('created_at')
            ->get()
            ->map(function (Customer $customer) {
                $currentStages = $customer->cardCustomers->sum('stamps_count');
                $totalStages = max(1, $customer->cardCustomers->sum('stamps_target'));
                $availableRewards = $customer->cardCustomers->sum('available_rewards');
                $redeemedRewards = $customer->cardCustomers->sum('redeemed_rewards');

                return [
                    'id' => $customer->id,
                    'name' => $customer->name,
                    'phone' => $customer->phone,
                    'email' => $customer->email,
                    'active_cards' => $customer->active_cards,
                    'current_stamps' => $currentStages,
                    'total_stamps' => $totalStages,
                    'available_rewards' => $availableRewards,
                    'redeemed_rewards' => $redeemedRewards,
                    'last_update' => optional($customer->updated_at)->toIso8601String(),
                    'created_at' => optional($customer->created_at)->toIso8601String(),
                ];
            });

        return response()->json(['data' => $customers]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20', 'unique:customers,phone'],
            'email' => ['nullable', 'email'],
            'birth_date' => ['nullable', 'date'],
            'language' => ['nullable', 'string', 'max:5'],
        ]);

        $businessId = $request->user()?->business_id ?? $request->input('business_id');

        $customer = Customer::create([
            ...$validated,
            'business_id' => $businessId,
        ]);

        return response()->json(['data' => $customer], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $customer = Customer::with([
            'cardCustomers.card',
            'cardCustomers.googleActivations',
            'transactions' => fn ($q) => $q->latest()->limit(10),
        ])
            ->findOrFail($id);

        return response()->json([
            'data' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'phone' => $customer->phone,
                'email' => $customer->email,
                'birth_date' => optional($customer->birth_date)->toDateString(),
                'language' => $customer->language,
                'loyalty_points' => $customer->loyalty_points,
                'last_visit_at' => optional($customer->last_visit_at)->toIso8601String(),
                'cards' => $customer->cardCustomers->map(function ($record) {
                    return [
                        'card' => array_merge(
                            $record->card?->only(['id', 'name']) ?? [],
                            ['card_code' => $record->card_code]
                        ),
                        'current_stage' => $record->current_stage,
                        'total_stages' => $record->total_stages,
                        'stamps_count' => $record->stamps_count,
                        'stamps_target' => $record->stamps_target,
                        'available_rewards' => $record->available_rewards,
                        'status' => $record->status,
                        'qr_url' => route('card-instances.qr', ['card_code' => $record->card_code]),
                        'pkpass_url' => route('card-instances.pkpass', ['card_code' => $record->card_code]),
                        'google_wallet_url' => route('card-instances.google-wallet', ['card_code' => $record->card_code]),
                        'google_wallet_installed_at' => optional($record->googleActivations->sortByDesc('activated_at')->first()?->activated_at)->toIso8601String(),
                        'google_object_id' => $record->google_object_id,
                        'google_class_id' => $record->google_class_id,
                        'last_google_update' => optional($record->last_google_update)->toIso8601String(),
                    ];
                }),
                'recent_transactions' => $customer->transactions->map(function ($transaction) {
                    return [
                        'id' => $transaction->id,
                        'type' => $transaction->type,
                        'amount' => $transaction->amount,
                        'currency' => $transaction->currency,
                        'note' => $transaction->note,
                        'reference' => $transaction->reference,
                        'happened_at' => optional($transaction->happened_at)->toIso8601String(),
                    ];
                }),
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $customer = Customer::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'phone' => ['sometimes', 'string', 'max:20', Rule::unique('customers', 'phone')->ignore($customer->id)],
            'email' => ['nullable', 'email'],
            'birth_date' => ['nullable', 'date'],
            'language' => ['nullable', 'string', 'max:5'],
            'loyalty_points' => ['nullable', 'integer', 'min:0'],
        ]);

        $customer->update($validated);

        return response()->json(['data' => $customer]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $customer = Customer::findOrFail($id);
        $customer->delete();

        return response()->json(['message' => 'تم حذف العميل']);
    }
}
