<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SystemLog extends Model
{
    protected $fillable = [
        'user_id',
        'business_id',
        'level',
        'category',
        'message',
        'user_name',
        'store_name',
        'ip_address',
        'details',
        'context',
    ];

    protected $casts = [
        'details' => 'array',
        'context' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }
}
