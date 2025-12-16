<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('card_customers', function (Blueprint $table) {
            $table->string('card_code')->nullable()->after('customer_id');
            $table->string('qr_payload')->nullable()->after('card_code');
            $table->unsignedInteger('stamps_count')->default(0)->after('current_stage');
            $table->unsignedInteger('stamps_target')->default(0)->after('stamps_count');
            $table->string('qr_asset_path')->nullable()->after('stamps_target');
            $table->timestamp('apple_wallet_installed_at')->nullable()->after('qr_asset_path');
            $table->timestamp('last_scanned_at')->nullable()->after('apple_wallet_installed_at');
        });

        DB::table('card_customers')->orderBy('id')->chunk(100, function ($records) {
            foreach ($records as $record) {
                $card = DB::table('cards')->where('id', $record->card_id)->first();
                $customer = DB::table('customers')->where('id', $record->customer_id)->first();
                if (! $card || ! $customer) {
                    continue;
                }

                $cardCode = $record->card_code ?? static::generateCode((int) $record->id);
                $qrPayload = sprintf('%s|%s|%s', $customer->name, $card->name, $cardCode);

                DB::table('card_customers')
                    ->where('id', $record->id)
                    ->update([
                        'card_code' => $cardCode,
                        'qr_payload' => $qrPayload,
                        'stamps_target' => $record->total_stages ?? 0,
                    ]);
            }
        });

        Schema::table('card_customers', function (Blueprint $table) {
            $table->unique('card_code');
        });

        Schema::create('card_activations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('card_id')->constrained()->cascadeOnDelete();
            $table->foreignId('card_customer_id')->constrained('card_customers')->cascadeOnDelete();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            $table->string('channel')->default('pkpass');
            $table->string('device_type')->nullable();
            $table->string('device_identifier')->nullable();
            $table->timestamp('activated_at')->useCurrent();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('card_activations');

        Schema::table('card_customers', function (Blueprint $table) {
            $table->dropUnique('card_customers_card_code_unique');
            $table->dropColumn([
                'card_code',
                'qr_payload',
                'stamps_count',
                'stamps_target',
                'qr_asset_path',
                'apple_wallet_installed_at',
                'last_scanned_at',
            ]);
        });
    }

    private static function generateCode(int $seed): string
    {
        $base = strtoupper(Str::random(4));
        $numbers = str_pad((string) ($seed * rand(2, 9)), 8, '0');
        $chunks = [substr($numbers, 0, 4), substr($numbers, 4, 4), substr($base, 0, 4)];

        return implode('-', array_filter($chunks));
    }
};
