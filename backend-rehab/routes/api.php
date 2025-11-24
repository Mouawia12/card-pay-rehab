<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BusinessController;
use App\Http\Controllers\Api\CardController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\BlogPostController;
use App\Http\Controllers\Api\SubscriptionPlanController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\AdminDashboardController;

Route::prefix('v1')->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    Route::get('/blog', [BlogPostController::class, 'index']);
    Route::get('/blog/{id}', [BlogPostController::class, 'show']);
    Route::get('/plans', [SubscriptionPlanController::class, 'index']);
    Route::get('/plans/{id}', [SubscriptionPlanController::class, 'show']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        Route::get('/dashboard/summary', [DashboardController::class, 'summary']);
        Route::get('/admin/summary', [AdminDashboardController::class, 'summary']);

        Route::apiResource('businesses', BusinessController::class);
        Route::apiResource('cards', CardController::class);
        Route::apiResource('customers', CustomerController::class);
        Route::apiResource('products', ProductController::class);
        Route::apiResource('transactions', TransactionController::class);
        Route::apiResource('blog', BlogPostController::class)->except(['index', 'show']);
        Route::apiResource('plans', SubscriptionPlanController::class)->except(['index', 'show']);
    });
});
