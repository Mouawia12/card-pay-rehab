<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SubscriptionPlanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $plans = SubscriptionPlan::where('is_active', true)->orderBy('price')->get();

        return response()->json(['data' => $plans]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:subscription_plans,slug'],
            'price' => ['required', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:5'],
            'interval' => ['nullable', Rule::in(['monthly', 'yearly'])],
            'description' => ['nullable', 'string'],
            'features' => ['nullable', 'array'],
            'limits' => ['nullable', 'array'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $plan = SubscriptionPlan::create([
            ...$validated,
            'slug' => $validated['slug'] ?? \Str::slug($validated['name']),
            'interval' => $validated['interval'] ?? 'monthly',
            'currency' => $validated['currency'] ?? 'SAR',
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json(['data' => $plan], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $plan = SubscriptionPlan::where('slug', $id)->orWhere('id', $id)->firstOrFail();

        return response()->json(['data' => $plan]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $plan = SubscriptionPlan::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'slug' => ['sometimes', 'string', 'max:255', Rule::unique('subscription_plans', 'slug')->ignore($plan->id)],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:5'],
            'interval' => ['nullable', Rule::in(['monthly', 'yearly'])],
            'description' => ['nullable', 'string'],
            'features' => ['nullable', 'array'],
            'limits' => ['nullable', 'array'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $plan->update($validated);

        return response()->json(['data' => $plan]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $plan = SubscriptionPlan::findOrFail($id);
        $plan->delete();

        return response()->json(['message' => 'تم حذف الخطة']);
    }
}
