<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\EnsuresAdmin;
use App\Http\Controllers\Controller;
use App\Models\MarketingCampaign;
use App\Models\MarketingCoupon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminMarketingController extends Controller
{
    use EnsuresAdmin;

    public function index(Request $request)
    {
        $this->ensureAdmin($request);

        $coupons = MarketingCoupon::orderByDesc('starts_at')
            ->get()
            ->map(fn (MarketingCoupon $coupon) => $this->transformCoupon($coupon));

        $campaigns = MarketingCampaign::with('coupons:id,code')
            ->orderByDesc('starts_at')
            ->get()
            ->map(fn (MarketingCampaign $campaign) => $this->transformCampaign($campaign));

        $stats = [
            'total_coupons' => $coupons->count(),
            'active_coupons' => $coupons->where('raw_status', 'active')->count(),
            'active_campaigns' => $campaigns->where('raw_status', 'active')->count(),
            'total_savings' => $this->formatCurrency(
                MarketingCoupon::sum('total_savings'),
                'SAR'
            ),
        ];

        return response()->json([
            'data' => [
                'stats' => $stats,
                'coupons' => $coupons,
                'campaigns' => $campaigns,
            ],
        ]);
    }

    public function showCoupon(Request $request, MarketingCoupon $coupon)
    {
        $this->ensureAdmin($request);

        return response()->json([
            'data' => $this->transformCoupon($coupon),
        ]);
    }

    public function updateCoupon(Request $request, MarketingCoupon $coupon)
    {
        $this->ensureAdmin($request);

        $validated = $request->validate([
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('marketing_coupons', 'code')->ignore($coupon->id),
            ],
            'type' => ['required', Rule::in(['percentage', 'fixed'])],
            'value' => ['required', 'numeric', 'min:0'],
            'min_purchase_amount' => ['nullable', 'numeric', 'min:0'],
            'usage_count' => ['nullable', 'integer', 'min:0'],
            'max_usage' => ['nullable', 'integer', 'min:1'],
            'status' => ['required', Rule::in(['active', 'finished', 'draft', 'expired', 'paused'])],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'total_savings' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:5'],
        ]);

        $coupon->fill([
            'code' => $validated['code'],
            'type' => $validated['type'],
            'value' => $validated['value'],
            'min_purchase_amount' => $validated['min_purchase_amount'] ?? null,
            'usage_count' => $validated['usage_count'] ?? $coupon->usage_count,
            'max_usage' => $validated['max_usage'] ?? null,
            'status' => $validated['status'],
            'starts_at' => $validated['starts_at'] ?? null,
            'ends_at' => $validated['ends_at'] ?? null,
            'total_savings' => $validated['total_savings'] ?? $coupon->total_savings,
            'currency' => $validated['currency'] ?? $coupon->currency,
        ])->save();

        $coupon->refresh();

        return response()->json([
            'message' => __('تم تحديث الكوبون بنجاح'),
            'data' => $this->transformCoupon($coupon),
        ]);
    }

    public function showCampaign(Request $request, MarketingCampaign $campaign)
    {
        $this->ensureAdmin($request);

        $campaign->load('coupons:id,code');

        return response()->json([
            'data' => $this->transformCampaign($campaign),
        ]);
    }

    public function updateCampaign(Request $request, MarketingCampaign $campaign)
    {
        $this->ensureAdmin($request);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['required', Rule::in(['active', 'finished', 'draft', 'expired', 'paused'])],
            'target_audience' => ['nullable', 'string', 'max:255'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'conversions' => ['nullable', 'integer', 'min:0'],
            'roi_percentage' => ['nullable', 'numeric'],
            'total_spent' => ['nullable', 'numeric', 'min:0'],
            'total_revenue' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:5'],
            'coupon_ids' => ['nullable', 'array'],
            'coupon_ids.*' => ['integer', 'exists:marketing_coupons,id'],
        ]);

        $campaign->fill([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'status' => $validated['status'],
            'target_audience' => $validated['target_audience'] ?? null,
            'starts_at' => $validated['starts_at'] ?? null,
            'ends_at' => $validated['ends_at'] ?? null,
            'conversions' => $validated['conversions'] ?? $campaign->conversions,
            'roi_percentage' => $validated['roi_percentage'] ?? $campaign->roi_percentage,
            'total_spent' => $validated['total_spent'] ?? $campaign->total_spent,
            'total_revenue' => $validated['total_revenue'] ?? $campaign->total_revenue,
            'currency' => $validated['currency'] ?? $campaign->currency,
        ])->save();

        if (array_key_exists('coupon_ids', $validated)) {
            $campaign->coupons()->sync($validated['coupon_ids']);
        }

        $campaign->load('coupons:id,code');

        return response()->json([
            'message' => __('تم تحديث الحملة بنجاح'),
            'data' => $this->transformCampaign($campaign),
        ]);
    }

    private function statusLabel(string $status): string
    {
        return match ($status) {
            'finished', 'expired' => 'منتهي',
            'draft' => 'مسودة',
            'paused' => 'متوقف',
            default => 'نشط',
        };
    }

    private function formatCurrency(float $amount, string $currency = 'SAR'): string
    {
        return sprintf('%s %s', $currency, number_format($amount, 0));
    }

    private function transformCoupon(MarketingCoupon $coupon): array
    {
        return [
            'id' => $coupon->id,
            'code' => $coupon->code,
            'type' => $coupon->type,
            'value' => (float) $coupon->value,
            'discount_text' => $coupon->type === 'percentage'
                ? sprintf('%s%%', $coupon->value)
                : sprintf('%s %s', $coupon->currency, number_format($coupon->value, 0)),
            'min_purchase' => $coupon->min_purchase_amount,
            'usage_count' => $coupon->usage_count,
            'max_usage' => $coupon->max_usage,
            'status' => $this->statusLabel($coupon->status),
            'raw_status' => $coupon->status,
            'start_date' => optional($coupon->starts_at)->toDateString(),
            'end_date' => optional($coupon->ends_at)->toDateString(),
            'total_savings' => $this->formatCurrency($coupon->total_savings, $coupon->currency),
            'currency' => $coupon->currency,
            'total_savings_value' => (float) $coupon->total_savings,
        ];
    }

    private function transformCampaign(MarketingCampaign $campaign): array
    {
        $campaign->loadMissing('coupons:id,code');

        return [
            'id' => $campaign->id,
            'name' => $campaign->name,
            'description' => $campaign->description,
            'coupons' => $campaign->coupons->pluck('code'),
            'coupon_ids' => $campaign->coupons->pluck('id'),
            'status' => $this->statusLabel($campaign->status),
            'raw_status' => $campaign->status,
            'target_audience' => $campaign->target_audience,
            'start_date' => optional($campaign->starts_at)->toDateString(),
            'end_date' => optional($campaign->ends_at)->toDateString(),
            'conversions' => $campaign->conversions,
            'roi' => sprintf('%s%%', number_format($campaign->roi_percentage, 1)),
            'roi_percentage' => (float) $campaign->roi_percentage,
            'total_spent' => $this->formatCurrency($campaign->total_spent, $campaign->currency),
            'total_revenue' => $this->formatCurrency($campaign->total_revenue, $campaign->currency),
            'currency' => $campaign->currency,
            'total_spent_value' => (float) $campaign->total_spent,
            'total_revenue_value' => (float) $campaign->total_revenue,
        ];
    }
}
