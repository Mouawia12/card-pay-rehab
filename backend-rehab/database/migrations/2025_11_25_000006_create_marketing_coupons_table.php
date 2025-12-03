<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('marketing_coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('type'); // percentage | fixed
            $table->decimal('value', 10, 2);
            $table->decimal('min_purchase_amount', 10, 2)->nullable();
            $table->unsignedInteger('usage_count')->default(0);
            $table->unsignedInteger('max_usage')->nullable();
            $table->string('status')->default('active');
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->decimal('total_savings', 12, 2)->default(0);
            $table->string('currency', 5)->default('SAR');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('marketing_coupons');
    }
};
