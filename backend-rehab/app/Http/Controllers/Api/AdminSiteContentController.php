<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\EnsuresAdmin;
use App\Http\Controllers\Controller;
use App\Models\SiteContent;
use Illuminate\Http\Request;

class AdminSiteContentController extends Controller
{
    use EnsuresAdmin;

    public function index(Request $request)
    {
        $this->ensureAdmin($request);

        $language = $request->query('language', 'ar');

        $sections = SiteContent::where('language', $language)
            ->get()
            ->mapWithKeys(fn (SiteContent $content) => [$content->section => $content->content]);

        return response()->json(['data' => $sections]);
    }

    public function show(Request $request, string $section)
    {
        $this->ensureAdmin($request);

        $language = $request->query('language', 'ar');

        $content = SiteContent::firstOrCreate(
            ['language' => $language, 'section' => $section],
            ['content' => []]
        );

        return response()->json(['data' => $content->content]);
    }

    public function update(Request $request, string $section)
    {
        $this->ensureAdmin($request);

        $data = $request->validate([
            'language' => ['required', 'string', 'in:ar,en'],
            'content' => ['required', 'array'],
        ]);

        $record = SiteContent::updateOrCreate(
            ['language' => $data['language'], 'section' => $section],
            ['content' => $data['content']]
        );

        return response()->json(['data' => $record->content]);
    }
}
