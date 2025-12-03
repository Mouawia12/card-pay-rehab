<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\EnsuresAdmin;
use App\Http\Controllers\Controller;
use App\Models\SystemLog;
use Illuminate\Http\Request;

class AdminSystemLogController extends Controller
{
    use EnsuresAdmin;

    public function index(Request $request)
    {
        $this->ensureAdmin($request);

        $logs = SystemLog::with(['user:id,name', 'business:id,name'])
            ->orderByDesc('created_at')
            ->limit(100)
            ->get()
            ->map(function (SystemLog $log) {
                return [
                    'id' => $log->id,
                    'timestamp' => optional($log->created_at)->toDateTimeString(),
                    'level' => strtoupper($log->level),
                    'category' => $log->category,
                    'message' => $log->message,
                    'user' => $log->user?->name ?? $log->user_name ?? 'System',
                    'store' => $log->business?->name ?? $log->store_name ?? 'System',
                    'ip' => $log->ip_address,
                    'details' => $log->details,
                ];
            });

        $stats = [
            'total_logs' => $logs->count(),
            'error_logs' => $logs->where('level', 'ERROR')->count(),
            'warning_logs' => $logs->where('level', 'WARNING')->count(),
            'info_logs' => $logs->where('level', 'INFO')->count(),
        ];

        return response()->json([
            'data' => [
                'logs' => $logs,
                'stats' => $stats,
            ],
        ]);
    }
}
