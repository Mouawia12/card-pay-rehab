<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $businessId = $request->user()?->business_id ?? $request->query('business_id');

        $products = Product::when($businessId, fn ($q) => $q->where('business_id', $businessId))
            ->orderByDesc('created_at')
            ->get()
            ->map(function (Product $product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'sku' => $product->sku,
                    'price' => $product->price,
                    'currency' => $product->currency,
                    'stock' => $product->stock,
                    'status' => $product->status,
                    'category' => $product->category,
                    'image_url' => $product->image_url,
                ];
            });

        return response()->json(['data' => $products]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['required', 'string', 'max:100', 'unique:products,sku'],
            'price' => ['required', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:5'],
            'stock' => ['nullable', 'integer', 'min:0'],
            'status' => ['nullable', 'string'],
            'category' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image_url' => ['nullable', 'string'],
        ]);

        $businessId = $request->user()?->business_id ?? $request->input('business_id');

        $product = Product::create([
            ...$validated,
            'business_id' => $businessId,
            'currency' => $validated['currency'] ?? 'SAR',
            'stock' => $validated['stock'] ?? 0,
            'status' => $validated['status'] ?? 'active',
        ]);

        return response()->json(['data' => $product], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::findOrFail($id);

        return response()->json(['data' => $product]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'sku' => ['sometimes', 'string', 'max:100', Rule::unique('products', 'sku')->ignore($product->id)],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:5'],
            'stock' => ['nullable', 'integer', 'min:0'],
            'status' => ['nullable', 'string'],
            'category' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image_url' => ['nullable', 'string'],
        ]);

        $product->update($validated);

        return response()->json(['data' => $product]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json(['message' => 'تم حذف المنتج']);
    }
}
