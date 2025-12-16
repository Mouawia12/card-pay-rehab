<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CardTemplate;

class CardTemplateController extends Controller
{
    public function index()
    {
        $templates = CardTemplate::orderBy('id')->get()->map(fn (CardTemplate $template) => $this->transform($template));

        return response()->json(['data' => $templates]);
    }

    public function show(CardTemplate $card_template)
    {
        return response()->json(['data' => $this->transform($card_template)]);
    }

    protected function transform(CardTemplate $template): array
    {
        return [
            'id' => $template->id,
            'name' => $template->name,
            'title' => $template->title,
            'description' => $template->description,
            'bgColor' => $template->bg_color,
            'bgOpacity' => $template->bg_opacity,
            'bgImage' => $template->bg_image,
            'textColor' => $template->text_color,
            'cardType' => $template->card_type,
            'totalStages' => $template->total_stages,
            'activeStampType' => $template->active_stamp_type,
            'inactiveStampType' => $template->inactive_stamp_type,
            'cardDescription' => $template->card_description,
            'howToEarnStamp' => $template->how_to_earn,
            'companyName' => $template->company_name,
            'termsOfUse' => $template->terms_of_use,
            'sourceCompanyName' => $template->source_company_name,
            'sourceEmail' => $template->source_email,
            'phoneNumber' => $template->phone_number,
            'countryCode' => $template->country_code,
            'colors' => $template->colors ?? [
                'backgroundColor' => $template->bg_color,
                'textColor' => $template->text_color,
                'middleAreaBg' => '#FFFFFF',
                'activeStamp' => '#FF0000',
                'stampBackground' => '#F2F2F2',
                'borderColor' => '#000000',
                'inactiveStamp' => '#CCCCCC',
            ],
        ];
    }
}
