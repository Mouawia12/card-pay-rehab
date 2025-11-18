<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Card;
use App\Models\Customer;

class CardCustomer extends Model
{
    protected $fillable = [
        'card_id',
        'customer_id',
        'issue_date',
        'expiry_date',
        'current_stage',
        'total_stages',
        'available_rewards',
        'redeemed_rewards',
        'status',
        'last_redeemed_at',
        'metadata',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'expiry_date' => 'date',
        'last_redeemed_at' => 'datetime',
        'metadata' => 'array',
    ];

    public function card(): BelongsTo
    {
        return $this->belongsTo(Card::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }
}
