<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subscription_plan_id')->constrained()->cascadeOnDelete();
            $table->string('status')->default('active'); // active | canceled | expired | trial
            $table->decimal('amount', 10, 2);
            $table->string('currency', 5)->default('SAR');
            $table->boolean('auto_renew')->default(true);
            $table->string('payment_method')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamp('last_payment_at')->nullable();
            $table->timestamp('next_payment_at')->nullable();
            $table->decimal('total_paid', 12, 2)->default(0);
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
