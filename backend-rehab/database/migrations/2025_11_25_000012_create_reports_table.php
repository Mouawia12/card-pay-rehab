<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type')->default('financial');
            $table->string('period')->nullable();
            $table->timestamp('generated_at')->nullable();
            $table->string('status')->default('completed'); // completed | processing | failed
            $table->string('format')->default('pdf');
            $table->string('file_size')->nullable();
            $table->string('path')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
