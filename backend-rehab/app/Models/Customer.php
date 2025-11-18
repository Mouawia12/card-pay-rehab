<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Business;
use App\Models\CardCustomer;
use App\Models\Transaction;

class Customer extends Model
{
    protected $fillable = [
        'business_id',
        'name',
        'phone',
        'email',
        'birth_date',
        'language',
        'loyalty_points',
        'last_visit_at',
        'metadata',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'last_visit_at' => 'datetime',
        'metadata' => 'array',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function cardCustomers(): HasMany
    {
        return $this->hasMany(CardCustomer::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
