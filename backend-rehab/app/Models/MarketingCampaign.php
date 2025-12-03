<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class MarketingCampaign extends Model
{
    protected $fillable = [
        'name',
        'description',
        'status',
        'target_audience',
        'starts_at',
        'ends_at',
        'conversions',
        'roi_percentage',
        'total_spent',
        'total_revenue',
        'currency',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
    ];

    public function coupons(): BelongsToMany
    {
        return $this->belongsToMany(MarketingCoupon::class, 'campaign_coupon')
            ->withTimestamps();
    }
}
