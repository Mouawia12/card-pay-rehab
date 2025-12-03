<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\EnsuresAdmin;
use App\Http\Controllers\Controller;
use App\Models\BlogCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class BlogCategoryController extends Controller
{
    use EnsuresAdmin;

    public function index(Request $request)
    {
        $this->ensureAdmin($request);

        $categories = BlogCategory::withCount('posts')
            ->orderBy('name_ar')
            ->get();

        return response()->json(['data' => $categories]);
    }

    public function store(Request $request)
    {
        $this->ensureAdmin($request);

        $data = $request->validate([
            'name_ar' => ['required', 'string', 'max:255'],
            'name_en' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', Rule::unique('blog_categories', 'slug')],
            'description_ar' => ['nullable', 'string'],
            'description_en' => ['nullable', 'string'],
            'color' => ['nullable', 'string', 'max:20'],
        ]);

        $category = BlogCategory::create([
            ...$data,
            'slug' => $data['slug'] ?? Str::slug($data['name_en']).'-'.Str::random(4),
        ]);

        return response()->json(['data' => $category], 201);
    }

    public function update(Request $request, BlogCategory $category)
    {
        $this->ensureAdmin($request);

        $data = $request->validate([
            'name_ar' => ['sometimes', 'string', 'max:255'],
            'name_en' => ['sometimes', 'string', 'max:255'],
            'slug' => ['sometimes', 'string', Rule::unique('blog_categories', 'slug')->ignore($category->id)],
            'description_ar' => ['nullable', 'string'],
            'description_en' => ['nullable', 'string'],
            'color' => ['nullable', 'string', 'max:20'],
        ]);

        $category->update($data);

        return response()->json(['data' => $category]);
    }

    public function destroy(Request $request, BlogCategory $category)
    {
        $this->ensureAdmin($request);

        $category->delete();

        return response()->json(['message' => 'تم حذف التصنيف']);
    }
}
