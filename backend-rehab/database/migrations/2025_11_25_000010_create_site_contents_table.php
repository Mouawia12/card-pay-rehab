<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_contents', function (Blueprint $table) {
            $table->id();
            $table->string('language', 5)->default('ar');
            $table->string('section');
            $table->json('content');
            $table->timestamps();
            $table->unique(['language', 'section']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_contents');
    }
};
