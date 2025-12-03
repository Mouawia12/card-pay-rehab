<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class MarketingCoupon extends Model
{
    protected $fillable = [
        'code',
        'type',
        'value',
        'min_purchase_amount',
        'usage_count',
        'max_usage',
        'status',
        'starts_at',
        'ends_at',
        'total_savings',
        'currency',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
    ];

    public function campaigns(): BelongsToMany
    {
        return $this->belongsToMany(MarketingCampaign::class, 'campaign_coupon')
            ->withTimestamps();
    }
}
