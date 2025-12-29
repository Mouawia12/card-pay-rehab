<?php

namespace App\Services;

class QrPayloadService
{
    public function generate(string $customerName, string $issuerName, string $cardCode, ?int $expiresAt = null): string
    {
        $expiry = $expiresAt ?? (now()->addMinutes($this->ttlMinutes())->timestamp);
        $signature = $this->sign($cardCode, $expiry);

        return sprintf('%s|%s|%s|%d|%s', $customerName, $issuerName, $cardCode, $expiry, $signature);
    }

    public function verify(string $cardCode, int $expiresAt, string $signature): bool
    {
        if ($expiresAt < now()->timestamp) {
            return false;
        }

        return hash_equals($this->sign($cardCode, $expiresAt), $signature);
    }

    private function sign(string $cardCode, int $expiresAt): string
    {
        return hash_hmac('sha256', $cardCode . '|' . $expiresAt, $this->secret());
    }

    private function secret(): string
    {
        $secret = (string) config('services.scan_signature_secret');
        if ($secret !== '') {
            return $secret;
        }

        return (string) config('app.key');
    }

    private function ttlMinutes(): int
    {
        $ttl = (int) config('services.scan_qr_ttl_minutes', 525600);

        return $ttl > 0 ? $ttl : 525600;
    }
}
