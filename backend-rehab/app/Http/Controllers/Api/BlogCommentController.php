<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\EnsuresAdmin;
use App\Http\Controllers\Controller;
use App\Models\BlogComment;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BlogCommentController extends Controller
{
    use EnsuresAdmin;

    public function update(Request $request, BlogComment $blogComment)
    {
        $this->ensureAdmin($request);

        $data = $request->validate([
            'status' => ['required', Rule::in(['approved', 'pending', 'rejected'])],
        ]);

        $blogComment->update($data);

        return response()->json(['data' => $blogComment]);
    }

    public function destroy(Request $request, BlogComment $blogComment)
    {
        $this->ensureAdmin($request);

        $blogComment->delete();

        return response()->json(['message' => 'تم حذف التعليق']);
    }
}
