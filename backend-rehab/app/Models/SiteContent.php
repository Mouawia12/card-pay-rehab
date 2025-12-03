<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteContent extends Model
{
    protected $fillable = [
        'language',
        'section',
        'content',
    ];

    protected $casts = [
        'content' => 'array',
    ];
}
