<?php

namespace App\Services;

use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Color\Color;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\Label\LabelAlignment;
use Endroid\QrCode\RoundBlockSizeMode;
use Endroid\QrCode\Writer\PngWriter;

class QrCodeService
{
    public function generate(string $payload, ?string $labelText = null): string
    {
        $builder = new Builder(
            writer: new PngWriter(),
            data: $payload,
            encoding: new Encoding('UTF-8'),
            errorCorrectionLevel: ErrorCorrectionLevel::High,
            size: 600,
            margin: 20,
            roundBlockSizeMode: RoundBlockSizeMode::Margin,
            foregroundColor: new Color(0, 0, 0),
            backgroundColor: new Color(255, 255, 255),
            labelText: $labelText ?? '',
            labelAlignment: LabelAlignment::Center,
            labelTextColor: new Color(0, 0, 0)
        );

        $result = $builder->build();

        return $result->getString();
    }
}
