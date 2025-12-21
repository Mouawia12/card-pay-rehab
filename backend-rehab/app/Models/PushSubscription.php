<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Business;
use App\Models\CardCustomer;

class PushSubscription extends Model
{
    protected $fillable = [
        'card_customer_id',
        'business_id',
        'endpoint',
        'public_key',
        'auth_token',
        'user_agent',
        'platform',
        'is_active',
        'subscribed_at',
        'unsubscribed_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'subscribed_at' => 'datetime',
        'unsubscribed_at' => 'datetime',
    ];

    public function cardCustomer(): BelongsTo
    {
        return $this->belongsTo(CardCustomer::class);
    }

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
