<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Business;
use App\Models\Card;
use App\Models\Customer;
use App\Models\Product;

class Transaction extends Model
{
    protected $fillable = [
        'business_id',
        'card_id',
        'customer_id',
        'product_id',
        'scanned_by',
        'type',
        'amount',
        'currency',
        'reference',
        'note',
        'happened_at',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'happened_at' => 'datetime',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function card(): BelongsTo
    {
        return $this->belongsTo(Card::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function scanner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'scanned_by');
    }
}
