<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'pkpass' => [
        'pass_type_id' => env('PKPASS_TYPE_ID', 'pass.com.rehab.demo'),
        'team_id' => env('PKPASS_TEAM_ID', 'TEAMID1234'),
        'organization' => env('PKPASS_ORGANIZATION', 'Rehab Loyalty'),
        'certificate_path' => env('PKPASS_CERTIFICATE_PATH'),
        'certificate_password' => env('PKPASS_CERTIFICATE_PASSWORD'),
    ],

    'google_wallet' => [
        'service_account_json' => env('GOOGLE_WALLET_SERVICE_ACCOUNT'),
        'issuer_id' => env('GOOGLE_WALLET_ISSUER_ID'),
        'class_id_prefix' => env('GOOGLE_WALLET_CLASS_PREFIX', 'rehab'),
        'origin' => env('GOOGLE_WALLET_ORIGIN', env('APP_URL')),
        'enabled' => env('GOOGLE_WALLET_ENABLED', true),
    ],

];
