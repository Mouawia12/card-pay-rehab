<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CardActivationGoogle extends Model
{
    protected $table = 'card_activations_google';

    protected $fillable = [
        'card_customer_id',
        'activated_at',
        'device_type',
        'device_identifier',
        'wallet_type',
        'metadata',
    ];

    protected $casts = [
        'activated_at' => 'datetime',
        'metadata' => 'array',
    ];

    public function cardCustomer(): BelongsTo
    {
        return $this->belongsTo(CardCustomer::class);
    }
}
