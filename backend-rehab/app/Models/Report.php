<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = [
        'name',
        'type',
        'period',
        'generated_at',
        'status',
        'format',
        'file_size',
        'path',
    ];

    protected $casts = [
        'generated_at' => 'datetime',
    ];
}
