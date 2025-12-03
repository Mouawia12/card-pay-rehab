<?php

namespace App\Http\Controllers\Api\Concerns;

use Illuminate\Http\Request;
use Illuminate\Http\Response;

trait EnsuresAdmin
{
    protected function ensureAdmin(Request $request): void
    {
        $user = $request->user();

        if (! $user || $user->role !== 'admin') {
            abort(Response::HTTP_FORBIDDEN, 'غير مصرح');
        }
    }
}
