<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Models\CardCustomer;
use App\Services\GoogleWalletService;

Artisan::command('google-wallet:backfill {--card_code=} {--limit=0} {--chunk=25} {--dry-run}', function (GoogleWalletService $googleWalletService) {
    if (! config('services.google_wallet.enabled')) {
        $this->warn('Google Wallet integration is disabled. Set GOOGLE_WALLET_ENABLED=true then rerun.');
        return;
    }

    $query = CardCustomer::query()->whereNull('google_object_id');

    if ($cardCode = $this->option('card_code')) {
        $query->where('card_code', $cardCode);
    }

    $total = (int) $query->count();
    $this->info("Found {$total} card(s) missing google_object_id.");

    if ($total === 0) {
        return;
    }

    $maxToProcess = (int) $this->option('limit');
    $chunkSize = max(1, (int) $this->option('chunk'));

    if ($this->option('dry-run')) {
        $sample = $query->orderBy('id')
            ->limit($maxToProcess > 0 ? $maxToProcess : 10)
            ->get(['id', 'card_code']);

        $this->table(['id', 'card_code'], $sample->map(fn ($card) => [
            'id' => $card->id,
            'card_code' => $card->card_code,
        ])->toArray());
        return;
    }

    $processed = 0;
    $success = 0;
    $failed = [];

    $query->orderBy('id')->chunkById($chunkSize, function ($cards) use (&$processed, &$success, &$failed, $maxToProcess, $googleWalletService) {
        foreach ($cards as $card) {
            if ($maxToProcess > 0 && $processed >= $maxToProcess) {
                return false;
            }

            try {
                $card->loadMissing(['card.business', 'customer']);
                $result = $googleWalletService->generate($card);
                $card->update([
                    'google_object_id' => $result['object_id'] ?? $card->google_object_id,
                    'google_class_id' => $result['class_id'] ?? $card->google_class_id,
                    'last_google_update' => now(),
                ]);
                $success++;
            } catch (\Throwable $e) {
                report($e);
                $failed[] = sprintf('ID %s (%s): %s', $card->id, $card->card_code, $e->getMessage());
            } finally {
                $processed++;
            }
        }
    });

    $this->info("Processed {$processed} card(s). Success: {$success}. Failed: " . count($failed) . '.');

    foreach ($failed as $line) {
        $this->warn($line);
    }
})->purpose('Backfill missing google_object_id values and objects for loyalty cards');

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
