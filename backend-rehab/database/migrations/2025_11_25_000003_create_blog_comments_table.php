<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blog_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('blog_post_id')
                ->constrained('blog_posts')
                ->cascadeOnDelete();
            $table->string('author_name');
            $table->string('author_email');
            $table->text('content');
            $table->string('status')->default('pending'); // pending | approved | rejected
            $table->unsignedInteger('likes')->default(0);
            $table->unsignedInteger('replies_count')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blog_comments');
    }
};
