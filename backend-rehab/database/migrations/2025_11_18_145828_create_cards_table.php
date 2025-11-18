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
        Schema::create('cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('title')->nullable();
            $table->string('card_code')->unique();
            $table->string('description')->nullable();
            $table->date('issue_date')->nullable();
            $table->date('expiry_date')->nullable();
            $table->string('bg_color')->default('#3498DB');
            $table->decimal('bg_opacity', 3, 2)->default(0.9);
            $table->string('bg_image')->nullable();
            $table->string('text_color')->default('#ffffff');
            $table->string('status')->default('active'); // active | paused | archived
            $table->unsignedInteger('current_stage')->default(0);
            $table->unsignedInteger('total_stages')->default(1);
            $table->json('settings')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cards');
    }
};
