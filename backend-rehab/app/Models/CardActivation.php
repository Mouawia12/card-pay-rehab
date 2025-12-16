<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Business;
use App\Models\Card;
use App\Models\CardCustomer;
use App\Models\Customer;

class CardActivation extends Model
{
    protected $fillable = [
        'card_id',
        'card_customer_id',
        'customer_id',
        'business_id',
        'channel',
        'device_type',
        'device_identifier',
        'activated_at',
        'metadata',
    ];

    protected $casts = [
        'activated_at' => 'datetime',
        'metadata' => 'array',
    ];

    public function card(): BelongsTo
    {
        return $this->belongsTo(Card::class);
    }

    public function issuedCard(): BelongsTo
    {
        return $this->belongsTo(CardCustomer::class, 'card_customer_id');
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }
}
