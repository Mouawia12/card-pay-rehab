<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('marketing_campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('status')->default('draft'); // active | finished | draft
            $table->string('target_audience')->nullable();
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->unsignedInteger('conversions')->default(0);
            $table->decimal('roi_percentage', 6, 2)->default(0);
            $table->decimal('total_spent', 12, 2)->default(0);
            $table->decimal('total_revenue', 12, 2)->default(0);
            $table->string('currency', 5)->default('SAR');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('marketing_campaigns');
    }
};
