<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\EnsuresAdmin;
use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\Subscription;
use App\Models\Transaction;
use Illuminate\Http\Request;

class AdminReportController extends Controller
{
    use EnsuresAdmin;

    public function index(Request $request)
    {
        $this->ensureAdmin($request);

        $reports = Report::orderByDesc('generated_at')
            ->limit(20)
            ->get()
            ->map(function (Report $report) {
                return [
                    'id' => $report->id,
                    'name' => $report->name,
                    'type' => $report->type,
                    'period' => $report->period,
                    'generated_date' => optional($report->generated_at)->toDateString(),
                    'status' => $this->statusLabel($report->status),
                    'raw_status' => $report->status,
                    'size' => $report->file_size ?? '0 MB',
                    'format' => strtoupper($report->format),
                ];
            });

        $financialSummary = $this->financialSummary();

        return response()->json([
            'data' => [
                'reports' => $reports,
                'financial_summary' => $financialSummary,
            ],
        ]);
    }

    private function financialSummary(): array
    {
        $totalRevenue = (float) Transaction::sum('amount');
        $stores = max(1, Transaction::distinct('business_id')->count('business_id'));

        $currentMonthRevenue = (float) Transaction::whereBetween('happened_at', [now()->startOfMonth(), now()->endOfMonth()])->sum('amount');

        $previousStart = now()->copy()->subMonth()->startOfMonth();
        $previousEnd = $previousStart->copy()->endOfMonth();
        $previousMonthRevenue = (float) Transaction::whereBetween('happened_at', [$previousStart, $previousEnd])->sum('amount');

        $monthlyGrowth = $previousMonthRevenue > 0
            ? (($currentMonthRevenue - $previousMonthRevenue) / $previousMonthRevenue) * 100
            : 0;

        $planRevenue = Subscription::selectRaw('subscription_plan_id, SUM(amount) as total')
            ->with('plan:id,name')
            ->groupBy('subscription_plan_id')
            ->orderByDesc('total')
            ->first();

        return [
            'total_revenue' => $this->formatCurrency($totalRevenue),
            'monthly_growth' => number_format($monthlyGrowth, 1),
            'top_revenue_source' => $planRevenue?->plan?->name ?? 'غير محدد',
            'avg_revenue_per_store' => $this->formatCurrency($totalRevenue / $stores),
            'projected_revenue' => $this->formatCurrency($totalRevenue * 1.12),
        ];
    }

    private function statusLabel(string $status): string
    {
        return match ($status) {
            'processing' => 'جاري الإعداد',
            'failed' => 'فشل',
            default => 'مكتمل',
        };
    }

    private function formatCurrency(float $amount): string
    {
        return 'SAR ' . number_format($amount, 0);
    }
}
