<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('campaign_coupon', function (Blueprint $table) {
            $table->id();
            $table->foreignId('marketing_campaign_id')
                ->constrained('marketing_campaigns')
                ->cascadeOnDelete();
            $table->foreignId('marketing_coupon_id')
                ->constrained('marketing_coupons')
                ->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['marketing_campaign_id', 'marketing_coupon_id'], 'campaign_coupon_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaign_coupon');
    }
};
