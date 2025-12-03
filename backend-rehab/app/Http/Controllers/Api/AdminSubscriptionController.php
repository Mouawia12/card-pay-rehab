<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\EnsuresAdmin;
use App\Http\Controllers\Controller;
use App\Models\Subscription;
use Illuminate\Http\Request;

class AdminSubscriptionController extends Controller
{
    use EnsuresAdmin;

    public function index(Request $request)
    {
        $this->ensureAdmin($request);

        $records = Subscription::with([
            'business:id,name',
            'plan:id,name,price,currency',
        ])
            ->orderByDesc('started_at')
            ->get();

        $subscriptions = $records->map(fn (Subscription $subscription) => $this->transformSubscription($subscription));

        $stats = [
            'total_revenue' => $this->formatCurrency((float) $records->sum('total_paid')),
            'active_subscriptions' => $records->where('status', 'active')->count(),
            'expiring_soon' => $records->filter(fn (Subscription $sub) => $sub->ends_at && $sub->ends_at->between(now(), now()->addDays(30)))->count(),
            'trial_accounts' => $records->where('status', 'trial')->count(),
        ];

        return response()->json([
            'data' => [
                'stats' => $stats,
                'subscriptions' => $subscriptions,
            ],
        ]);
    }

    public function renew(Request $request, Subscription $subscription)
    {
        $this->ensureAdmin($request);

        $subscription->status = 'active';
        $subscription->auto_renew = true;
        $subscription->last_payment_at = now();
        $subscription->started_at = now();
        $subscription->ends_at = now()->addMonth();
        $subscription->next_payment_at = $subscription->ends_at?->copy();
        $subscription->total_paid = ($subscription->total_paid ?? 0) + ($subscription->amount ?? 0);
        $subscription->save();

        return response()->json([
            'message' => 'تم تجديد الاشتراك',
            'data' => $this->transformSubscription($subscription),
        ]);
    }

    public function cancel(Request $request, Subscription $subscription)
    {
        $this->ensureAdmin($request);

        $subscription->status = 'canceled';
        $subscription->auto_renew = false;
        $subscription->ends_at = now();
        $subscription->next_payment_at = null;
        $subscription->save();

        return response()->json([
            'message' => 'تم إلغاء الاشتراك',
            'data' => $this->transformSubscription($subscription),
        ]);
    }

    private function formatCurrency(float $amount, string $currency = 'SAR'): string
    {
        return sprintf('%s %s', $currency, number_format($amount, 0));
    }

    private function statusLabel(string $status): string
    {
        return match ($status) {
            'canceled' => 'ملغي',
            'expired' => 'منتهي',
            'trial' => 'تجريبي',
            default => 'نشط',
        };
    }

    private function transformSubscription(Subscription $subscription): array
    {
        $subscription->loadMissing([
            'business:id,name',
            'plan:id,name,price,currency',
        ]);

        return [
            'id' => $subscription->id,
            'store_name' => $subscription->business?->name,
            'plan' => $subscription->plan?->name,
            'status' => $this->statusLabel($subscription->status),
            'raw_status' => $subscription->status,
            'amount' => $this->formatCurrency($subscription->amount ?? 0, $subscription->currency ?? 'SAR'),
            'start_date' => optional($subscription->started_at)->toDateString(),
            'end_date' => optional($subscription->ends_at)->toDateString(),
            'auto_renew' => (bool) $subscription->auto_renew,
            'payment_method' => $subscription->payment_method,
            'last_payment' => optional($subscription->last_payment_at)->toDateString(),
            'next_payment' => optional($subscription->next_payment_at)->toDateString(),
            'total_paid' => $this->formatCurrency($subscription->total_paid ?? 0, $subscription->currency ?? 'SAR'),
        ];
    }

}
