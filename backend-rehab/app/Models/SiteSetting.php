<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = [
        'group',
        'settings',
    ];

    protected $casts = [
        'settings' => 'array',
    ];
}
