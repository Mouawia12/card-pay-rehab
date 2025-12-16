<?php

namespace App\Services;

use Endroid\QrCode\Color\Color;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel\ErrorCorrectionLevelHigh;
use Endroid\QrCode\Label\LabelAlignment;
use Endroid\QrCode\Label\Label;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;

class QrCodeService
{
    public function generate(string $payload, ?string $labelText = null): string
    {
        $qrCode = QrCode::create($payload)
            ->setEncoding(new Encoding('UTF-8'))
            ->setErrorCorrectionLevel(new ErrorCorrectionLevelHigh())
            ->setSize(600)
            ->setMargin(20)
            ->setForegroundColor(new Color(0, 0, 0))
            ->setBackgroundColor(new Color(255, 255, 255));

        $writer = new PngWriter();

        $label = null;
        if ($labelText) {
            $label = Label::create($labelText)
                ->setTextColor(new Color(0, 0, 0))
                ->setAlignment(new LabelAlignment(LabelAlignment::CENTER));
        }

        $result = $writer->write($qrCode, null, $label);

        return $result->getString();
    }
}
