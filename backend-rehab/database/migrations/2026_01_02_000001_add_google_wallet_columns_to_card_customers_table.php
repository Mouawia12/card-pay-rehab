<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('card_customers', function (Blueprint $table) {
            $table->string('google_object_id')->nullable()->unique()->after('qr_asset_path');
            $table->string('google_class_id')->nullable()->after('google_object_id');
            $table->timestamp('last_google_update')->nullable()->after('google_class_id');
        });
    }

    public function down(): void
    {
        Schema::table('card_customers', function (Blueprint $table) {
            $table->dropUnique('card_customers_google_object_id_unique');
            $table->dropColumn(['google_object_id', 'google_class_id', 'last_google_update']);
        });
    }
};
