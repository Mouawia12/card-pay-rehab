<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('card_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->string('bg_color')->nullable();
            $table->decimal('bg_opacity', 3, 2)->default(0.9);
            $table->string('bg_image')->nullable();
            $table->string('text_color')->default('#ffffff');
            $table->unsignedTinyInteger('card_type')->default(0);
            $table->unsignedInteger('total_stages')->default(6);
            $table->string('active_stamp_type')->nullable();
            $table->string('inactive_stamp_type')->nullable();
            $table->text('card_description')->nullable();
            $table->text('how_to_earn')->nullable();
            $table->string('company_name')->nullable();
            $table->text('terms_of_use')->nullable();
            $table->string('source_company_name')->nullable();
            $table->string('source_email')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('country_code', 10)->nullable();
            $table->json('colors')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('card_templates');
    }
};
