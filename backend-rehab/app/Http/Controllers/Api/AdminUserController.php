<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\EnsuresAdmin;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    use EnsuresAdmin;

    public function index(Request $request)
    {
        $this->ensureAdmin($request);

        $users = User::with([
            'business:id,name',
            'business.subscriptions' => fn ($query) => $query->latest('started_at')->limit(1),
            'roles.permissions:id,name',
        ])
            ->select('id', 'name', 'email', 'phone', 'role', 'business_id', 'is_active', 'created_at', 'last_login_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (User $user) => $this->transformUser($user));

        $stats = [
            'total' => $users->count(),
            'active' => $users->where('is_active', true)->count(),
            'store_owners' => $users->where('raw_role', 'merchant')->count(),
            'managers' => $users->where('raw_role', 'staff')->count(),
        ];

        return response()->json([
            'data' => [
                'stats' => $stats,
                'users' => $users->values(),
            ],
        ]);
    }

    public function show(Request $request, User $user)
    {
        $this->ensureAdmin($request);

        return response()->json([
            'data' => $this->transformUser($user),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $this->ensureAdmin($request);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'phone' => ['nullable', 'string', 'max:50'],
            'role' => ['sometimes', 'string', Rule::in(['admin', 'merchant', 'staff'])],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $user->fill([
            'name' => $validated['name'] ?? $user->name,
            'email' => $validated['email'] ?? $user->email,
            'phone' => $validated['phone'] ?? $user->phone,
        ]);

        if (isset($validated['role'])) {
            $user->role = $validated['role'];
        }

        if (array_key_exists('is_active', $validated)) {
            $user->is_active = (bool) $validated['is_active'];
        }

        $user->save();

        return response()->json([
            'data' => $this->transformUser($user),
            'message' => 'تم تحديث المستخدم',
        ]);
    }

    public function destroy(Request $request, User $user)
    {
        $this->ensureAdmin($request);

        if ($request->user()->id === $user->id) {
            return response()->json([
                'message' => 'لا يمكن حذف حساب المسؤول الحالي',
            ], 422);
        }

        $user->delete();

        return response()->json([
            'message' => 'تم حذف المستخدم',
        ]);
    }

    private function transformUser(User $user): array
    {
        $user->loadMissing([
            'business:id,name',
            'business.subscriptions' => fn ($query) => $query->latest('started_at')->limit(1),
            'roles.permissions:id,name',
        ]);

        $subscription = $user->business?->subscriptions->first();
        $status = $this->statusLabel($user, $subscription?->status);
        $permissions = $user->roles
            ->flatMap(fn ($role) => $role->permissions->pluck('name'))
            ->unique()
            ->values();

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role' => $this->roleLabel($user->role),
            'raw_role' => $user->role,
            'store' => $user->business?->name,
            'status' => $status,
            'is_active' => (bool) $user->is_active,
            'join_date' => optional($user->created_at)->toDateString(),
            'last_login' => optional($user->last_login_at)->toDateTimeString(),
            'permissions' => $permissions,
        ];
    }

    private function roleLabel(?string $role): string
    {
        return match ($role) {
            'admin' => 'مسؤول',
            'merchant' => 'مالك متجر',
            'staff' => 'مدير',
            default => 'موظف',
        };
    }

    private function statusLabel(User $user, ?string $subscriptionStatus): string
    {
        if (! $user->is_active) {
            return 'متوقف';
        }

        return $subscriptionStatus === 'trial' ? 'تجريبي' : 'نشط';
    }
}
