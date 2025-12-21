<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CardCustomer;
use App\Models\PushSubscription;
use App\Services\WebPushService;
use Illuminate\Http\Request;

class PushSubscriptionController extends Controller
{
    public function __construct(private readonly WebPushService $webPushService)
    {
    }

    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'card_code' => ['required', 'string', 'exists:card_customers,card_code'],
            'subscription' => ['required', 'array'],
            'subscription.endpoint' => ['required', 'string'],
            'subscription.keys' => ['required', 'array'],
            'subscription.keys.p256dh' => ['required', 'string'],
            'subscription.keys.auth' => ['required', 'string'],
            'platform' => ['nullable', 'string', 'max:255'],
        ]);

        $card = CardCustomer::with('card')->where('card_code', $validated['card_code'])->firstOrFail();
        $subscriptionData = $validated['subscription'];

        PushSubscription::updateOrCreate([
            'endpoint' => $subscriptionData['endpoint'],
        ], [
            'card_customer_id' => $card->id,
            'business_id' => $card->card?->business_id,
            'public_key' => $subscriptionData['keys']['p256dh'],
            'auth_token' => $subscriptionData['keys']['auth'],
            'user_agent' => $request->userAgent(),
            'platform' => $validated['platform'] ?? null,
            'is_active' => true,
            'subscribed_at' => now(),
            'unsubscribed_at' => null,
        ]);

        return response()->json(['data' => ['status' => 'subscribed']]);
    }

    public function unsubscribe(Request $request)
    {
        $validated = $request->validate([
            'endpoint' => ['required', 'string'],
        ]);

        $subscription = PushSubscription::where('endpoint', $validated['endpoint'])->first();
        if ($subscription) {
            $subscription->update([
                'is_active' => false,
                'unsubscribed_at' => now(),
            ]);
        }

        return response()->json(['data' => ['status' => 'unsubscribed']]);
    }

    public function sendMarketing(Request $request)
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:200'],
            'title' => ['nullable', 'string', 'max:80'],
            'scope' => ['nullable', 'in:all,business'],
            'business_id' => ['nullable', 'integer', 'exists:businesses,id'],
        ]);

        $user = $request->user();
        $scope = $validated['scope'] ?? 'business';
        $businessId = $validated['business_id'] ?? $user?->business_id;

        if ($scope === 'all') {
            if ($user?->role !== 'admin') {
                abort(403, 'غير مصرح');
            }
            $sent = $this->webPushService->sendToAll([
                'title' => $validated['title'] ?? 'عرض جديد',
                'body' => $validated['message'],
                'data' => [
                    'type' => 'marketing',
                    'url' => config('app.frontend_url', config('app.url')),
                ],
            ]);

            return response()->json(['data' => ['sent' => $sent]]);
        }

        if (! $businessId) {
            abort(403, 'غير مصرح');
        }

        $sent = $this->webPushService->sendToBusiness($businessId, [
            'title' => $validated['title'] ?? 'عرض جديد',
            'body' => $validated['message'],
            'data' => [
                'type' => 'marketing',
                'business_id' => $businessId,
                'url' => config('app.frontend_url', config('app.url')),
            ],
        ]);

        return response()->json(['data' => ['sent' => $sent]]);
    }
}
