<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\EnsuresAdmin;
use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\Customer;
use App\Models\Subscription;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class AdminAnalyticsController extends Controller
{
    use EnsuresAdmin;

    public function __invoke(Request $request)
    {
        $this->ensureAdmin($request);

        $monthlyGrowth = $this->monthlyGrowth();
        $planDistribution = $this->planDistribution();
        $topStores = $this->topStores();
        $userActivity = $this->userActivity();

        $stats = [
            'total_revenue' => $this->formatCurrency(Transaction::sum('amount')),
            'total_stores' => Business::count(),
            'total_users' => User::count(),
            'avg_growth' => $this->averageGrowth($monthlyGrowth),
        ];

        return response()->json([
            'data' => [
                'stats' => $stats,
                'monthly_growth' => $monthlyGrowth,
                'plan_distribution' => $planDistribution,
                'top_stores' => $topStores,
                'user_activity' => $userActivity,
            ],
        ]);
    }

    private function monthlyGrowth(): Collection
    {
        $start = Carbon::now()->subMonths(9)->startOfMonth();
        $months = collect();

        $transactionSummary = Transaction::select(
            DB::raw("DATE_FORMAT(happened_at, '%Y-%m') as ym"),
            DB::raw('COUNT(DISTINCT business_id) as stores'),
            DB::raw('SUM(amount) as revenue')
        )
            ->where('happened_at', '>=', $start)
            ->groupBy('ym')
            ->get()
            ->keyBy('ym');

        $newUsers = Customer::select(
            DB::raw("DATE_FORMAT(created_at, '%Y-%m') as ym"),
            DB::raw('COUNT(*) as users')
        )
            ->where('created_at', '>=', $start)
            ->groupBy('ym')
            ->pluck('users', 'ym');

        for ($i = 0; $i < 10; $i++) {
            $month = $start->copy()->addMonths($i);
            $key = $month->format('Y-m');

            $months->push([
                'month' => $month->format('M Y'),
                'stores' => optional($transactionSummary->get($key))->stores ?? 0,
                'revenue' => (float) (optional($transactionSummary->get($key))->revenue ?? 0),
                'users' => (int) ($newUsers[$key] ?? 0),
            ]);
        }

        return $months;
    }

    private function planDistribution(): Collection
    {
        $colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899'];

        return Subscription::select('subscription_plan_id', DB::raw('COUNT(*) as value'))
            ->with('plan:id,name')
            ->groupBy('subscription_plan_id')
            ->get()
            ->map(function ($record, $index) use ($colors) {
                return [
                    'name' => $record->plan?->name ?? 'خطة غير معروفة',
                    'value' => $record->value,
                    'color' => $colors[$index % count($colors)],
                ];
            });
    }

    private function topStores(): Collection
    {
        $currentMonth = Carbon::now()->startOfMonth();
        $previousMonth = $currentMonth->copy()->subMonth();

        $previousRevenue = Transaction::select('business_id', DB::raw('SUM(amount) as revenue'))
            ->whereBetween('happened_at', [$previousMonth, $previousMonth->copy()->endOfMonth()])
            ->groupBy('business_id')
            ->pluck('revenue', 'business_id');

        return Transaction::select('business_id', DB::raw('SUM(amount) as revenue'), DB::raw('COUNT(DISTINCT customer_id) as customers'))
            ->whereBetween('happened_at', [$currentMonth, $currentMonth->copy()->endOfMonth()])
            ->with('business:id,name')
            ->groupBy('business_id')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get()
            ->map(function ($record) use ($previousRevenue) {
                $previous = (float) ($previousRevenue[$record->business_id] ?? 0);
                $growth = $previous > 0
                    ? number_format((($record->revenue - $previous) / $previous) * 100, 1)
                    : '0.0';

                return [
                    'name' => $record->business?->name ?? 'متجر غير معروف',
                    'revenue' => (float) $record->revenue,
                    'customers' => (int) $record->customers,
                    'growth' => sprintf('+%s%%', $growth),
                ];
            });
    }

    private function userActivity(): Collection
    {
        $start = Carbon::now()->subDay();

        $activity = Transaction::select(
            DB::raw("DATE_FORMAT(happened_at, '%H:00') as hour"),
            DB::raw('COUNT(*) as active_users')
        )
            ->where('happened_at', '>=', $start)
            ->groupBy('hour')
            ->pluck('active_users', 'hour');

        $hours = collect();
        for ($i = 0; $i < 12; $i++) {
            $hour = $start->copy()->addHours($i * 2)->format('H:00');
            $hours->push([
                'hour' => $hour,
                'active_users' => (int) ($activity[$hour] ?? 0),
            ]);
        }

        return $hours;
    }

    private function averageGrowth(Collection $monthlyGrowth): string
    {
        if ($monthlyGrowth->count() < 2) {
            return '0%';
        }

        $first = $monthlyGrowth->first()['revenue'] ?: 1;
        $last = $monthlyGrowth->last()['revenue'] ?: $first;

        $growth = (($last - $first) / $first) * 100;

        return sprintf('%.1f%%', $growth);
    }

    private function formatCurrency(float $amount): string
    {
        return 'SAR ' . number_format($amount, 0);
    }
}
