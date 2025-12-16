<?php

namespace App\Services;

use App\Models\CardCustomer;
use Illuminate\Support\Str;

class CardCodeGenerator
{
    public static function make(): string
    {
        do {
            $segments = [];
            for ($i = 0; $i < 4; $i++) {
                $segments[] = strtoupper(Str::random(4));
            }
            $code = implode('-', $segments);
        } while (CardCustomer::where('card_code', $code)->exists());

        return $code;
    }
}
