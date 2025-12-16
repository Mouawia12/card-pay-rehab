<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CardTemplate extends Model
{
    protected $fillable = [
        'name',
        'title',
        'description',
        'bg_color',
        'bg_opacity',
        'bg_image',
        'text_color',
        'card_type',
        'total_stages',
        'active_stamp_type',
        'inactive_stamp_type',
        'card_description',
        'how_to_earn',
        'company_name',
        'terms_of_use',
        'source_company_name',
        'source_email',
        'phone_number',
        'country_code',
        'colors',
        'metadata',
    ];

    protected $casts = [
        'bg_opacity' => 'float',
        'colors' => 'array',
        'metadata' => 'array',
    ];
}
