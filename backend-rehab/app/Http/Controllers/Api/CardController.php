<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Card;
use App\Models\CardCustomer;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $businessId = $request->user()?->business_id ?? $request->query('business_id');

        $cards = Card::with(['business', 'creator'])
            ->withCount('cardCustomers')
            ->when($businessId, fn ($q) => $q->where('business_id', $businessId))
            ->orderByDesc('created_at')
            ->get()
            ->map(function (Card $card) {
                return [
                    'id' => $card->id,
                    'name' => $card->name,
                    'title' => $card->title,
                    'description' => $card->description,
                    'card_code' => $card->card_code,
                    'issue_date' => optional($card->issue_date)->toDateString(),
                    'expiry_date' => optional($card->expiry_date)->toDateString(),
                    'bg_color' => $card->bg_color,
                    'bg_opacity' => $card->bg_opacity,
                    'bg_image' => $card->bg_image,
                    'text_color' => $card->text_color,
                    'status' => $card->status,
                    'current_stage' => $card->current_stage,
                    'total_stages' => $card->total_stages,
                    'customers_count' => $card->card_customers_count,
                ];
            });

        return response()->json(['data' => $cards]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'issue_date' => ['nullable', 'date'],
            'expiry_date' => ['nullable', 'date', 'after_or_equal:issue_date'],
            'bg_color' => ['nullable', 'string', 'max:20'],
            'bg_opacity' => ['nullable', 'numeric', 'between:0,1'],
            'bg_image' => ['nullable', 'string'],
            'text_color' => ['nullable', 'string', 'max:20'],
            'status' => ['nullable', 'string'],
            'current_stage' => ['nullable', 'integer', 'min:0'],
            'total_stages' => ['required', 'integer', 'min:1'],
        ]);

        $businessId = $request->user()?->business_id ?? $request->input('business_id');

        $card = Card::create([
            ...$validated,
            'business_id' => $businessId,
            'created_by' => $request->user()?->id ?? null,
            'card_code' => Str::upper(Str::random(12)),
            'bg_color' => $validated['bg_color'] ?? '#3498DB',
            'bg_opacity' => $validated['bg_opacity'] ?? 0.9,
            'text_color' => $validated['text_color'] ?? '#ffffff',
            'status' => $validated['status'] ?? 'active',
        ]);

        return response()->json(['data' => $card], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $card = Card::with(['business', 'creator', 'cardCustomers.customer'])->findOrFail($id);

        return response()->json([
            'data' => [
                'id' => $card->id,
                'name' => $card->name,
                'title' => $card->title,
                'description' => $card->description,
                'card_code' => $card->card_code,
                'issue_date' => optional($card->issue_date)->toDateString(),
                'expiry_date' => optional($card->expiry_date)->toDateString(),
                'bg_color' => $card->bg_color,
                'bg_opacity' => $card->bg_opacity,
                'bg_image' => $card->bg_image,
                'text_color' => $card->text_color,
                'status' => $card->status,
                'current_stage' => $card->current_stage,
                'total_stages' => $card->total_stages,
                'customers' => $card->cardCustomers->map(function ($record) {
                    return [
                        'id' => $record->id,
                        'customer' => $record->customer?->only(['id', 'name', 'phone']),
                        'current_stage' => $record->current_stage,
                        'total_stages' => $record->total_stages,
                        'available_rewards' => $record->available_rewards,
                        'redeemed_rewards' => $record->redeemed_rewards,
                        'status' => $record->status,
                    ];
                }),
            ],
        ]);
    }

    public function assignCustomer(Request $request, Card $card)
    {
        $businessId = $request->user()?->business_id ?? $request->input('business_id');
        if ($businessId && $card->business_id !== $businessId) {
            return response()->json(['message' => 'غير مسموح بإدارة هذه البطاقة'], 403);
        }

        $validated = $request->validate([
            'customer_id' => ['nullable', 'exists:customers,id'],
            'name' => ['required_without:customer_id', 'string', 'max:255'],
            'phone' => ['required_without:customer_id', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:255'],
            'language' => ['nullable', 'string', 'max:5'],
            'issue_date' => ['nullable', 'date'],
            'expiry_date' => ['nullable', 'date', 'after_or_equal:issue_date'],
        ]);

        if ($card->business_id !== ($request->user()?->business_id ?? $card->business_id)) {
            return response()->json(['message' => 'البطاقة لا تتبع نشاطك التجاري'], 403);
        }

        if (! empty($validated['customer_id'])) {
            $customer = Customer::where('business_id', $card->business_id)
                ->where('id', $validated['customer_id'])
                ->firstOrFail();
        } else {
            $customer = Customer::firstOrCreate(
                [
                    'business_id' => $card->business_id,
                    'phone' => $validated['phone'],
                ],
                [
                    'name' => $validated['name'],
                    'email' => $validated['email'] ?? null,
                    'language' => $validated['language'] ?? 'ar',
                ]
            );
        }

        $assignment = CardCustomer::updateOrCreate(
            [
                'card_id' => $card->id,
                'customer_id' => $customer->id,
            ],
            [
                'issue_date' => $validated['issue_date'] ?? now(),
                'expiry_date' => $validated['expiry_date'] ?? null,
                'status' => 'active',
                'total_stages' => $card->total_stages,
            ]
        );

        $qrPayload = sprintf(
            '%s|%s|%s',
            $customer->name,
            $request->user()?->name ?? $card->creator?->name ?? 'Merchant',
            $card->card_code
        );

        return response()->json([
            'data' => [
                'card' => $card->only(['id', 'name', 'card_code', 'total_stages']),
                'customer' => $customer->only(['id', 'name', 'phone', 'email']),
                'assignment' => [
                    'id' => $assignment->id,
                    'issue_date' => optional($assignment->issue_date)->toDateString(),
                    'expiry_date' => optional($assignment->expiry_date)->toDateString(),
                    'current_stage' => $assignment->current_stage,
                    'total_stages' => $assignment->total_stages,
                    'available_rewards' => $assignment->available_rewards,
                ],
                'qr_payload' => $qrPayload,
            ],
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'issue_date' => ['nullable', 'date'],
            'expiry_date' => ['nullable', 'date', 'after_or_equal:issue_date'],
            'bg_color' => ['nullable', 'string', 'max:20'],
            'bg_opacity' => ['nullable', 'numeric', 'between:0,1'],
            'bg_image' => ['nullable', 'string'],
            'text_color' => ['nullable', 'string', 'max:20'],
            'status' => ['nullable', 'string'],
            'current_stage' => ['nullable', 'integer', 'min:0'],
            'total_stages' => ['nullable', 'integer', 'min:1'],
        ]);

        $card = Card::findOrFail($id);
        $card->update($validated);

        return response()->json(['data' => $card]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $card = Card::findOrFail($id);
        $card->delete();

        return response()->json(['message' => 'تم حذف البطاقة']);
    }
}
