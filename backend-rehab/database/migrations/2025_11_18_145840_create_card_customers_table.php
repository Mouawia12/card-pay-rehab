<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('card_customers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('card_id')->constrained()->cascadeOnDelete();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->date('issue_date')->nullable();
            $table->date('expiry_date')->nullable();
            $table->unsignedInteger('current_stage')->default(0);
            $table->unsignedInteger('total_stages')->default(0);
            $table->unsignedInteger('available_rewards')->default(0);
            $table->unsignedInteger('redeemed_rewards')->default(0);
            $table->string('status')->default('active');
            $table->timestamp('last_redeemed_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->unique(['card_id', 'customer_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('card_customers');
    }
};
