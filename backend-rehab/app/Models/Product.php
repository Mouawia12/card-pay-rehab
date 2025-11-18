<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Business;
use App\Models\Transaction;

class Product extends Model
{
    protected $fillable = [
        'business_id',
        'name',
        'sku',
        'description',
        'price',
        'stock',
        'currency',
        'status',
        'category',
        'image_url',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
