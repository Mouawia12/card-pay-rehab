<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Business;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class BusinessController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $businesses = Business::orderBy('name')->get();

        return response()->json(['data' => $businesses]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'unique:businesses,slug'],
            'email' => ['nullable', 'email'],
            'phone' => ['nullable', 'string', 'max:20'],
            'country' => ['nullable', 'string', 'max:100'],
            'city' => ['nullable', 'string', 'max:100'],
            'address' => ['nullable', 'string', 'max:255'],
            'currency' => ['nullable', 'string', 'max:5'],
            'theme_primary' => ['nullable', 'string', 'max:20'],
            'theme_secondary' => ['nullable', 'string', 'max:20'],
            'logo_url' => ['nullable', 'string'],
            'cover_url' => ['nullable', 'string'],
            'settings' => ['nullable', 'array'],
        ]);

        $business = Business::create([
            ...$validated,
            'slug' => $validated['slug'] ?? Str::slug($validated['name']),
            'currency' => $validated['currency'] ?? 'SAR',
        ]);

        return response()->json(['data' => $business], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $business = Business::where('slug', $id)->orWhere('id', $id)->firstOrFail();

        return response()->json(['data' => $business]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $business = Business::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'slug' => ['sometimes', 'string', Rule::unique('businesses', 'slug')->ignore($business->id)],
            'email' => ['nullable', 'email'],
            'phone' => ['nullable', 'string', 'max:20'],
            'country' => ['nullable', 'string', 'max:100'],
            'city' => ['nullable', 'string', 'max:100'],
            'address' => ['nullable', 'string', 'max:255'],
            'currency' => ['nullable', 'string', 'max:5'],
            'theme_primary' => ['nullable', 'string', 'max:20'],
            'theme_secondary' => ['nullable', 'string', 'max:20'],
            'logo_url' => ['nullable', 'string'],
            'cover_url' => ['nullable', 'string'],
            'settings' => ['nullable', 'array'],
        ]);

        $business->update($validated);

        return response()->json(['data' => $business]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $business = Business::findOrFail($id);
        $business->delete();

        return response()->json(['message' => 'تم حذف المتجر']);
    }
}
