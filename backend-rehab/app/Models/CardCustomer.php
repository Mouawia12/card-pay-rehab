<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Card;
use App\Models\CardActivation;
use App\Models\CardActivationGoogle;
use App\Models\Customer;

class CardCustomer extends Model
{
    protected $fillable = [
        'card_id',
        'customer_id',
        'card_code',
        'qr_payload',
        'issue_date',
        'expiry_date',
        'current_stage',
        'total_stages',
        'stamps_count',
        'stamps_target',
        'available_rewards',
        'redeemed_rewards',
        'status',
        'last_redeemed_at',
        'apple_wallet_installed_at',
        'last_scanned_at',
        'qr_asset_path',
        'google_object_id',
        'google_class_id',
        'last_google_update',
        'metadata',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'expiry_date' => 'date',
        'last_redeemed_at' => 'datetime',
        'apple_wallet_installed_at' => 'datetime',
        'last_scanned_at' => 'datetime',
        'last_google_update' => 'datetime',
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

    public function activations(): HasMany
    {
        return $this->hasMany(CardActivation::class);
    }

    public function googleActivations(): HasMany
    {
        return $this->hasMany(CardActivationGoogle::class);
    }
}
