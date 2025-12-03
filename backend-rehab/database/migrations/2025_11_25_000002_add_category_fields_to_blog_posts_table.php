<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->foreignId('category_id')
                ->nullable()
                ->after('author_id')
                ->constrained('blog_categories')
                ->nullOnDelete();
            $table->unsignedInteger('views_count')->default(0)->after('status');
            $table->unsignedInteger('likes_count')->default(0)->after('views_count');
            $table->boolean('is_featured')->default(false)->after('likes_count');
        });
    }

    public function down(): void
    {
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn(['category_id', 'views_count', 'likes_count', 'is_featured']);
        });
    }
};
