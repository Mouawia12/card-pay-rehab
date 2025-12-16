<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('card_activations_google', function (Blueprint $table) {
            $table->id();
            $table->foreignId('card_customer_id')->constrained('card_customers')->cascadeOnDelete();
            $table->timestamp('activated_at')->useCurrent();
            $table->string('device_type')->nullable();
            $table->string('device_identifier')->nullable();
            $table->string('wallet_type')->default('google');
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('card_activations_google');
    }
};
