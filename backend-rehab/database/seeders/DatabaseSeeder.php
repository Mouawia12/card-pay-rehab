<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use App\Models\Business;
use App\Models\Card;
use App\Models\CardCustomer;
use App\Models\Customer;
use App\Models\Product;
use App\Models\SubscriptionPlan;
use App\Models\Role;
use App\Models\Permission;
use App\Models\User;
use App\Models\Transaction;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $business = Business::create([
            'name' => 'Rehab QR',
            'slug' => 'rehab-qr',
            'email' => 'info@rehab-qr.com',
            'phone' => '+966556023195',
            'country' => 'Saudi Arabia',
            'city' => 'Riyadh',
            'currency' => 'SAR',
            'theme_primary' => '#3b82f6',
            'theme_secondary' => '#111827',
        ]);

        // Roles & permissions
        $roles = [
            'admin' => Role::create(['name' => 'Admin', 'slug' => 'admin', 'description' => 'Full access']),
            'merchant' => Role::create(['name' => 'Merchant', 'slug' => 'merchant', 'description' => 'Store owner']),
            'staff' => Role::create(['name' => 'Staff', 'slug' => 'staff', 'description' => 'Branch staff']),
        ];

        $permissions = [
            'manage_users' => Permission::create(['name' => 'Manage Users', 'slug' => 'manage_users']),
            'manage_cards' => Permission::create(['name' => 'Manage Cards', 'slug' => 'manage_cards']),
            'manage_customers' => Permission::create(['name' => 'Manage Customers', 'slug' => 'manage_customers']),
            'view_reports' => Permission::create(['name' => 'View Reports', 'slug' => 'view_reports']),
        ];

        $roles['admin']->permissions()->sync(collect($permissions)->pluck('id'));
        $roles['merchant']->permissions()->sync([
            $permissions['manage_cards']->id,
            $permissions['manage_customers']->id,
            $permissions['view_reports']->id,
        ]);
        $roles['staff']->permissions()->sync([
            $permissions['manage_customers']->id,
        ]);

        $admin = User::create([
            'name' => 'Main Admin',
            'email' => 'admin@rehab-qr.com',
            'phone' => '+966500000000',
            'role' => 'admin',
            'password' => Hash::make('password123'),
            'business_id' => $business->id,
        ]);

        $merchant = User::create([
            'name' => 'Shop Owner',
            'email' => 'merchant@rehab-qr.com',
            'phone' => '+966511111111',
            'role' => 'merchant',
            'password' => Hash::make('password123'),
            'business_id' => $business->id,
        ]);

        $staff = User::create([
            'name' => 'Branch Manager',
            'email' => 'staff@rehab-qr.com',
            'phone' => '+966522222222',
            'role' => 'staff',
            'password' => Hash::make('password123'),
            'business_id' => $business->id,
        ]);

        $admin->roles()->sync([$roles['admin']->id]);
        $merchant->roles()->sync([$roles['merchant']->id]);
        $staff->roles()->sync([$roles['staff']->id]);

        $plans = [
            [
                'name' => 'Basic',
                'slug' => 'basic',
                'price' => 99,
                'currency' => 'SAR',
                'interval' => 'monthly',
                'description' => 'خطة البداية مع الحزمة الأساسية',
                'features' => ['حتى 1,000 عميل', 'بطاقة ولاء واحدة', 'دعم عبر البريد'],
                'limits' => ['cards' => 1, 'customers' => 1000],
                'is_active' => true,
            ],
            [
                'name' => 'Business',
                'slug' => 'business',
                'price' => 219,
                'currency' => 'SAR',
                'interval' => 'monthly',
                'description' => 'لرواد الأعمال مع لوحة تحكم كاملة',
                'features' => ['حتى 10,000 عميل', '5 بطاقات ولاء', 'تقارير متقدمة', 'دعم واتساب'],
                'limits' => ['cards' => 5, 'customers' => 10000],
                'is_active' => true,
            ],
        ];

        foreach ($plans as $plan) {
            SubscriptionPlan::create($plan);
        }

        $cards = [
            [
                'name' => 'نادي اللياقة النخبة',
                'title' => 'تدرب وادخر',
                'description' => 'استمتع بمرافقنا الفاخرة واحصل على مكافآت حصرية!',
                'card_code' => '477-398-475-609',
                'issue_date' => now()->subDays(10),
                'expiry_date' => now()->addYears(2),
                'bg_color' => '#3498DB',
                'bg_opacity' => 0.87,
                'bg_image' => 'https://reward-loyalty-demo.nowsquare.com/files/126/conversions/1-sm.jpg',
                'text_color' => '#ffffff',
                'status' => 'active',
                'current_stage' => 2,
                'total_stages' => 5,
            ],
            [
                'name' => 'مغاسل وتلميع تذكار',
                'title' => 'غسيل احترافي',
                'description' => 'احصل على خدمات الغسيل والتلميع بجودة عالية ومكافآت مميزة',
                'card_code' => '123-456-789-012',
                'issue_date' => now()->subMonths(2),
                'expiry_date' => now()->addYear(),
                'bg_color' => '#1E324A',
                'bg_opacity' => 0.9,
                'bg_image' => null,
                'text_color' => '#ffffff',
                'status' => 'active',
                'current_stage' => 1,
                'total_stages' => 4,
            ],
        ];

        foreach ($cards as $cardData) {
            Card::create([
                ...$cardData,
                'business_id' => $business->id,
                'created_by' => $merchant->id,
            ]);
        }

        $customersData = [
            ['name' => 'توفيق حسن لغبي', 'phone' => '+966055180666'],
            ['name' => 'مداوي القحطاني', 'phone' => '+966580005528'],
            ['name' => 'سعيد', 'phone' => '+966551047087'],
            ['name' => 'ابو حاتم', 'phone' => '+966569941511'],
        ];

        $customers = collect($customersData)->map(function ($customer) use ($business) {
            return Customer::create([
                ...$customer,
                'business_id' => $business->id,
                'language' => 'ar',
                'loyalty_points' => rand(0, 200),
                'last_visit_at' => now()->subDays(rand(1, 10)),
            ]);
        });

        $cardRecords = Card::all();
        foreach ($customers as $index => $customer) {
            foreach ($cardRecords as $card) {
                CardCustomer::create([
                    'card_id' => $card->id,
                    'customer_id' => $customer->id,
                    'issue_date' => now()->subDays(5),
                    'expiry_date' => now()->addMonths(6),
                    'current_stage' => $index + 1,
                    'total_stages' => $card->total_stages,
                    'available_rewards' => $index % 2,
                    'redeemed_rewards' => $index === 0 ? 1 : 0,
                    'status' => 'active',
                ]);
            }
        }

        $products = [
            [
                'name' => 'اشتراك شهري',
                'sku' => 'SUB-MONTH',
                'price' => 149,
                'stock' => 100,
                'status' => 'active',
                'category' => 'اشتراكات',
            ],
            [
                'name' => 'غسيل وتلميع VIP',
                'sku' => 'CAR-WASH-VIP',
                'price' => 89,
                'stock' => 200,
                'status' => 'active',
                'category' => 'خدمات',
            ],
            [
                'name' => 'قبول دفع عبر QR',
                'sku' => 'QR-COLLECT',
                'price' => 0,
                'stock' => 9999,
                'status' => 'active',
                'category' => 'نظام وفاء',
            ],
        ];

        foreach ($products as $product) {
            Product::create([
                ...$product,
                'business_id' => $business->id,
                'currency' => 'SAR',
            ]);
        }

        Transaction::create([
            'business_id' => $business->id,
            'customer_id' => $customers->first()->id,
            'card_id' => $cardRecords->first()->id,
            'type' => 'stamp_awarded',
            'amount' => 0,
            'currency' => 'SAR',
            'note' => 'تم إضافة ختم للزيارة الأخيرة',
            'happened_at' => now()->subDay(),
        ]);

        BlogPost::create([
            'author_id' => $admin->id,
            'title' => 'إطلاق منصة الولاء الذكية',
            'slug' => 'smart-loyalty-launch',
            'excerpt' => 'تعرف على مزايا منصة الولاء الجديدة وإدارة البطاقات الرقمية.',
            'content' => 'من خلال هذه المنصة يمكنك إنشاء بطاقات ولاء رقمية، إضافة العملاء، وتتبع المكافآت في لوحة تحكم واحدة.',
            'status' => 'published',
            'published_at' => now()->subDays(3),
            'tags' => ['loyalty', 'qr', 'rewards'],
        ]);
    }
}
