<?php

namespace App\Services;

use App\Models\CardCustomer;
use App\Models\PushSubscription;
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;

class WebPushService
{
    public function sendToCard(CardCustomer $card, array $payload): int
    {
        $subscriptions = PushSubscription::active()
            ->where('card_customer_id', $card->id)
            ->get();

        return $this->send($subscriptions, $payload);
    }

    public function sendToBusiness(?int $businessId, array $payload): int
    {
        if (! $businessId) {
            return 0;
        }

        $subscriptions = PushSubscription::active()
            ->where('business_id', $businessId)
            ->get();

        return $this->send($subscriptions, $payload);
    }

    public function sendToAll(array $payload): int
    {
        $subscriptions = PushSubscription::active()->get();
        return $this->send($subscriptions, $payload);
    }

    private function send($subscriptions, array $payload): int
    {
        if ($subscriptions->isEmpty()) {
            return 0;
        }

        $webPush = $this->buildWebPush();
        if (! $webPush) {
            return 0;
        }

        $expiredEndpoints = [];
        $payloadJson = json_encode($payload, JSON_UNESCAPED_UNICODE);

        foreach ($subscriptions as $subscription) {
            $subscriptionData = Subscription::create([
                'endpoint' => $subscription->endpoint,
                'publicKey' => $subscription->public_key,
                'authToken' => $subscription->auth_token,
            ]);
            $webPush->queueNotification($subscriptionData, $payloadJson);
        }

        foreach ($webPush->flush() as $report) {
            if ($report->isSubscriptionExpired()) {
                $endpoint = $report->getRequest()->getUri()->__toString();
                $expiredEndpoints[] = $endpoint;
            }
        }

        if (! empty($expiredEndpoints)) {
            PushSubscription::whereIn('endpoint', $expiredEndpoints)
                ->update([
                    'is_active' => false,
                    'unsubscribed_at' => now(),
                ]);
        }

        return $subscriptions->count();
    }

    private function buildWebPush(): ?WebPush
    {
        $publicKey = config('services.web_push.public_key');
        $privateKey = config('services.web_push.private_key');
        $subject = config('services.web_push.subject');

        if (! $publicKey || ! $privateKey) {
            return null;
        }

        return new WebPush([
            'VAPID' => [
                'subject' => $subject,
                'publicKey' => $publicKey,
                'privateKey' => $privateKey,
            ],
        ]);
    }
}
