<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subscription extends Model
{
    protected $fillable = [
        'business_id',
        'subscription_plan_id',
        'status',
        'amount',
        'currency',
        'auto_renew',
        'payment_method',
        'started_at',
        'ends_at',
        'last_payment_at',
        'next_payment_at',
        'total_paid',
        'metadata',
    ];

    protected $casts = [
        'auto_renew' => 'boolean',
        'started_at' => 'datetime',
        'ends_at' => 'datetime',
        'last_payment_at' => 'datetime',
        'next_payment_at' => 'datetime',
        'metadata' => 'array',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class, 'subscription_plan_id');
    }
}
