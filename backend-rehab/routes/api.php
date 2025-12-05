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
use App\Http\Controllers\Api\AdminAnalyticsController;
use App\Http\Controllers\Api\AdminMarketingController;
use App\Http\Controllers\Api\AdminReportController;
use App\Http\Controllers\Api\AdminSettingsController;
use App\Http\Controllers\Api\AdminSiteContentController;
use App\Http\Controllers\Api\AdminStoreController;
use App\Http\Controllers\Api\AdminSubscriptionController;
use App\Http\Controllers\Api\AdminSystemLogController;
use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\BlogCategoryController;
use App\Http\Controllers\Api\BlogCommentController;

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
        Route::get('/admin/users', [AdminUserController::class, 'index']);
        Route::get('/admin/users/{user}', [AdminUserController::class, 'show']);
        Route::put('/admin/users/{user}', [AdminUserController::class, 'update']);
        Route::delete('/admin/users/{user}', [AdminUserController::class, 'destroy']);
        Route::get('/admin/stores', [AdminStoreController::class, 'index']);
        Route::get('/admin/stores/{business}', [AdminStoreController::class, 'show']);
        Route::get('/admin/analytics', AdminAnalyticsController::class);
        Route::get('/admin/subscriptions', [AdminSubscriptionController::class, 'index']);
        Route::post('/admin/subscriptions/{subscription}/renew', [AdminSubscriptionController::class, 'renew']);
        Route::post('/admin/subscriptions/{subscription}/cancel', [AdminSubscriptionController::class, 'cancel']);
        Route::prefix('/admin/marketing')->group(function () {
            Route::get('/', [AdminMarketingController::class, 'index']);
            Route::get('/coupons/{coupon}', [AdminMarketingController::class, 'showCoupon']);
            Route::put('/coupons/{coupon}', [AdminMarketingController::class, 'updateCoupon']);
            Route::get('/campaigns/{campaign}', [AdminMarketingController::class, 'showCampaign']);
            Route::put('/campaigns/{campaign}', [AdminMarketingController::class, 'updateCampaign']);
        });
        Route::get('/admin/reports', [AdminReportController::class, 'index']);
        Route::get('/admin/system-logs', [AdminSystemLogController::class, 'index']);
        Route::get('/admin/settings', [AdminSettingsController::class, 'index']);
        Route::get('/admin/settings/{group}', [AdminSettingsController::class, 'show']);
        Route::put('/admin/settings/{group}', [AdminSettingsController::class, 'update']);
        Route::get('/admin/site-content', [AdminSiteContentController::class, 'index']);
        Route::get('/admin/site-content/{section}', [AdminSiteContentController::class, 'show']);
        Route::put('/admin/site-content/{section}', [AdminSiteContentController::class, 'update']);

        Route::apiResource('businesses', BusinessController::class);
        Route::apiResource('cards', CardController::class);
        Route::post('/cards/{card}/assign', [CardController::class, 'assignCustomer']);
        Route::apiResource('customers', CustomerController::class);
        Route::apiResource('products', ProductController::class);
        Route::apiResource('transactions', TransactionController::class);
        Route::apiResource('blog', BlogPostController::class)->except(['index', 'show']);
        Route::apiResource('plans', SubscriptionPlanController::class)->except(['index', 'show']);
        Route::apiResource('blog-categories', BlogCategoryController::class)->except(['create', 'edit']);
        Route::apiResource('blog-comments', BlogCommentController::class)->only(['update', 'destroy']);
    });
});
