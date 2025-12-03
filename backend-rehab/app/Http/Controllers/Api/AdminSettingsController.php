<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\EnsuresAdmin;
use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;

class AdminSettingsController extends Controller
{
    use EnsuresAdmin;

    public function index(Request $request)
    {
        $this->ensureAdmin($request);

        $settings = SiteSetting::all()
            ->mapWithKeys(fn (SiteSetting $setting) => [$setting->group => $setting->settings]);

        return response()->json(['data' => $settings]);
    }

    public function show(Request $request, string $group)
    {
        $this->ensureAdmin($request);

        $setting = SiteSetting::firstOrCreate(
            ['group' => $group],
            ['settings' => []]
        );

        return response()->json(['data' => $setting->settings]);
    }

    public function update(Request $request, string $group)
    {
        $this->ensureAdmin($request);

        $data = $request->validate([
            'settings' => ['required', 'array'],
        ]);

        $setting = SiteSetting::updateOrCreate(
            ['group' => $group],
            ['settings' => $data['settings']]
        );

        return response()->json(['data' => $setting->settings]);
    }
}
