<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\Card;
use App\Models\Customer;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function summary(Request $request)
    {
        $user = $request->user();
        if (! $user || $user->role !== 'admin') {
            return response()->json(['message' => 'غير مصرح'], 403);
        }

        $businessesCount = Business::count();
        $usersCount = User::count();
        $cardsCount = Card::count();
        $customersCount = Customer::count();
        $transactionsCount = Transaction::count();
        $revenue = Transaction::sum('amount');

        $usersByRole = User::select('role', DB::raw('count(*) as total'))
            ->groupBy('role')
            ->pluck('total', 'role');

        $transactionsByDay = Transaction::select(
            DB::raw('DATE(happened_at) as day'),
            DB::raw('count(*) as total'),
            DB::raw('SUM(amount) as amount')
        )
            ->where('happened_at', '>=', Carbon::now()->subDays(10)->startOfDay())
            ->groupBy('day')
            ->orderBy('day')
            ->get();

        $latestTransactions = Transaction::with(['customer:id,name', 'card:id,name', 'product:id,name'])
            ->orderByDesc('happened_at')
            ->limit(5)
            ->get()
            ->map(function (Transaction $transaction) {
                return [
                    'id' => $transaction->id,
                    'type' => $transaction->type,
                    'amount' => $transaction->amount,
                    'currency' => $transaction->currency,
                    'note' => $transaction->note,
                    'happened_at' => optional($transaction->happened_at)->toIso8601String(),
                    'customer' => $transaction->customer?->only(['id', 'name']),
                    'card' => $transaction->card?->only(['id', 'name']),
                    'product' => $transaction->product?->only(['id', 'name']),
                ];
            });

        $latestBusinesses = Business::latest()->limit(5)->get(['id', 'name', 'email', 'city', 'created_at']);
        $latestCustomers = Customer::latest()->limit(5)->get(['id', 'name', 'phone', 'created_at']);

        return response()->json([
            'data' => [
                'totals' => [
                    'businesses' => $businessesCount,
                    'users' => $usersCount,
                    'cards' => $cardsCount,
                    'customers' => $customersCount,
                    'transactions' => $transactionsCount,
                    'revenue' => $revenue,
                ],
                'users_by_role' => $usersByRole,
                'transactions_by_day' => $transactionsByDay,
                'latest_transactions' => $latestTransactions,
                'latest_businesses' => $latestBusinesses,
                'latest_customers' => $latestCustomers,
            ],
        ]);
    }
}
