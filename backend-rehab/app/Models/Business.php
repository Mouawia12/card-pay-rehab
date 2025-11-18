<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\User;
use App\Models\Card;
use App\Models\Product;
use App\Models\Customer;
use App\Models\Transaction;

class Business extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'email',
        'phone',
        'whatsapp',
        'country',
        'city',
        'address',
        'currency',
        'theme_primary',
        'theme_secondary',
        'logo_url',
        'cover_url',
        'settings',
    ];

    protected $casts = [
        'settings' => 'array',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function cards(): HasMany
    {
        return $this->hasMany(Card::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function customers(): HasMany
    {
        return $this->hasMany(Customer::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function staff(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'business_user')->withTimestamps();
    }
}
