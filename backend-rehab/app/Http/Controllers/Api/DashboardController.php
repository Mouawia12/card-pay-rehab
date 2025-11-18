<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\Card;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function summary(Request $request)
    {
        $businessId = $request->user()?->business_id ?? $request->query('business_id');

        $cardQuery = Card::query();
        $customerQuery = Customer::query();
        $productQuery = Product::query();
        $transactionQuery = Transaction::query();

        if ($businessId) {
            $cardQuery->where('business_id', $businessId);
            $customerQuery->where('business_id', $businessId);
            $productQuery->where('business_id', $businessId);
            $transactionQuery->where('business_id', $businessId);
        }

        return response()->json([
            'data' => [
                'cards' => $cardQuery->count(),
                'customers' => $customerQuery->count(),
                'products' => $productQuery->count(),
                'transactions' => $transactionQuery->count(),
                'latest_transactions' => $transactionQuery->latest('happened_at')->limit(5)->get(),
                'latest_customers' => $customerQuery->latest()->limit(5)->get(['id', 'name', 'phone', 'created_at']),
            ],
        ]);
    }
}
