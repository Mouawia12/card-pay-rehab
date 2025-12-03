<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\EnsuresAdmin;
use App\Http\Controllers\Controller;
use App\Models\Business;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminStoreController extends Controller
{
    use EnsuresAdmin;

    public function index(Request $request)
    {
        $this->ensureAdmin($request);

        $businesses = Business::with([
            'users' => fn ($query) => $query->where('role', 'merchant')->select('id', 'name', 'email', 'phone', 'business_id'),
            'subscriptions' => fn ($query) => $query->latest('started_at')->limit(1)->with('plan:id,name'),
            'latestTransaction',
        ])
            ->withCount(['customers', 'cards'])
            ->withSum('transactions as total_revenue', 'amount')
            ->orderBy('name')
            ->get()
            ->map(function (Business $business) {
                $subscription = $business->subscriptions->first();
                $owner = $business->users->first();
                $status = $this->statusFromSubscription($subscription?->status);

                return [
                    'id' => $business->id,
                    'name' => $business->name,
                    'owner' => $owner?->name,
                    'email' => $owner?->email ?? $business->email,
                    'phone' => $owner?->phone ?? $business->phone,
                    'plan' => $subscription?->plan?->name ?? 'الأساسية',
                    'status' => $status,
                    'customers' => $business->customers_count,
                    'cards' => $business->cards_count,
                    'revenue' => $this->formatCurrency($business->total_revenue),
                    'join_date' => optional($business->created_at)->toDateString(),
                    'last_activity' => optional($business->latestTransaction?->happened_at)->toDateTimeString(),
                    'subscription_end' => optional($subscription?->ends_at)->toDateString(),
                ];
            });

        $stats = [
            'total_stores' => $businesses->count(),
            'total_customers' => $businesses->sum('customers'),
            'total_cards' => $businesses->sum('cards'),
            'active_stores' => $businesses->where('status', 'نشط')->count(),
        ];

        return response()->json([
            'data' => [
                'stats' => $stats,
                'stores' => $businesses,
            ],
        ]);
    }

    public function show(Request $request, $businessId)
    {
        $this->ensureAdmin($request);

        $business = Business::where('id', $businessId)
            ->orWhere('slug', $businessId)
            ->firstOrFail();

        $business->load([
            'users' => fn ($query) => $query->where('role', 'merchant')->select('id', 'name', 'email', 'phone', 'business_id'),
            'subscriptions' => fn ($query) => $query->latest('started_at')->limit(1)->with('plan:id,name,price,currency'),
            'latestTransaction',
        ])->loadCount(['customers', 'cards']);

        $subscription = $business->subscriptions->first();
        $owner = $business->users->first();
        $status = $this->statusFromSubscription($subscription?->status);

        $recentCustomers = $business->customers()
            ->select('id', 'name', 'phone', 'created_at')
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn ($customer) => [
                'id' => $customer->id,
                'name' => $customer->name,
                'phone' => $customer->phone,
                'join_date' => optional($customer->created_at)->toDateString(),
            ]);

        $monthlyData = $business->transactions()
            ->select(
                DB::raw("DATE_FORMAT(happened_at, '%Y-%m') as month"),
                DB::raw('COUNT(*) as customers'),
                DB::raw('SUM(amount) as revenue')
            )
            ->where('happened_at', '>=', now()->subMonths(6)->startOfMonth())
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn ($row) => [
                'month' => $row->month,
                'customers' => (int) $row->customers,
                'revenue' => $this->formatCurrency($row->revenue),
            ]);

        return response()->json([
            'data' => [
                'store' => [
                    'id' => $business->id,
                    'name' => $business->name,
                    'owner' => $owner?->name,
                    'email' => $owner?->email ?? $business->email,
                    'phone' => $owner?->phone ?? $business->phone,
                    'address' => $business->address,
                    'plan' => $subscription?->plan?->name ?? 'الأساسية',
                    'status' => $status,
                    'join_date' => optional($business->created_at)->toDateString(),
                    'subscription_end' => optional($subscription?->ends_at)->toDateString(),
                    'last_activity' => optional($business->latestTransaction?->happened_at)->toDateTimeString(),
                    'total_customers' => $business->customers_count,
                    'total_cards' => $business->cards_count,
                    'monthly_revenue' => $this->formatCurrency($business->transactions()->whereBetween('happened_at', [now()->startOfMonth(), now()->endOfMonth()])->sum('amount')),
                    'total_revenue' => $this->formatCurrency($business->transactions()->sum('amount')),
                    'description' => $business->settings['description'] ?? null,
                    'city' => $business->city,
                ],
                'recent_customers' => $recentCustomers,
                'monthly_data' => $monthlyData,
            ],
        ]);
    }

    private function statusFromSubscription(?string $status): string
    {
        return match ($status) {
            'trial' => 'تجريبي',
            'canceled', 'expired' => 'متوقف',
            default => 'نشط',
        };
    }

    private function formatCurrency($amount): string
    {
        $value = number_format((float) $amount, 0);

        return "SAR {$value}";
    }
}
