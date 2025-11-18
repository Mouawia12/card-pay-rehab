<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class BlogPostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $status = $request->query('status');

        $posts = BlogPost::with('author')
            ->when($status, fn ($q) => $q->where('status', $status))
            ->orderByDesc('published_at')
            ->get()
            ->map(function (BlogPost $post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'excerpt' => $post->excerpt,
                    'cover_image' => $post->cover_image,
                    'status' => $post->status,
                    'published_at' => optional($post->published_at)->toIso8601String(),
                    'author' => $post->author?->only(['id', 'name']),
                    'tags' => $post->tags,
                ];
            });

        return response()->json(['data' => $posts]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:blog_posts,slug'],
            'excerpt' => ['nullable', 'string'],
            'content' => ['required', 'string'],
            'cover_image' => ['nullable', 'string'],
            'status' => ['nullable', Rule::in(['draft', 'published'])],
            'tags' => ['nullable', 'array'],
        ]);

        $post = BlogPost::create([
            ...$validated,
            'author_id' => $request->user()?->id,
            'slug' => $validated['slug'] ?? Str::slug($validated['title']).'-'.Str::random(5),
            'status' => $validated['status'] ?? 'draft',
            'published_at' => ($validated['status'] ?? 'draft') === 'published' ? now() : null,
        ]);

        return response()->json(['data' => $post], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $post = BlogPost::with('author')->where('slug', $id)->orWhere('id', $id)->firstOrFail();

        return response()->json(['data' => $post]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $post = BlogPost::findOrFail($id);

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'slug' => ['sometimes', 'string', 'max:255', Rule::unique('blog_posts', 'slug')->ignore($post->id)],
            'excerpt' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'string'],
            'status' => ['nullable', Rule::in(['draft', 'published'])],
            'tags' => ['nullable', 'array'],
        ]);

        $post->update([
            ...$validated,
            'published_at' => ($validated['status'] ?? $post->status) === 'published'
                ? ($post->published_at ?? now())
                : null,
        ]);

        return response()->json(['data' => $post]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $post = BlogPost::findOrFail($id);
        $post->delete();

        return response()->json(['message' => 'تم حذف المقال']);
    }
}
