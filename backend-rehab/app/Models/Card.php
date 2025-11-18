<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Business;
use App\Models\User;
use App\Models\CardCustomer;
use App\Models\Transaction;

class Card extends Model
{
    protected $fillable = [
        'business_id',
        'created_by',
        'name',
        'title',
        'card_code',
        'description',
        'issue_date',
        'expiry_date',
        'bg_color',
        'bg_opacity',
        'bg_image',
        'text_color',
        'status',
        'current_stage',
        'total_stages',
        'settings',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'expiry_date' => 'date',
        'settings' => 'array',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
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
