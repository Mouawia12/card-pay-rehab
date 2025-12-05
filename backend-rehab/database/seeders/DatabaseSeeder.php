<?php

namespace Database\Seeders;

use App\Models\BlogCategory;
use App\Models\BlogComment;
use App\Models\BlogPost;
use App\Models\Business;
use App\Models\Card;
use App\Models\CardCustomer;
use App\Models\Customer;
use App\Models\MarketingCampaign;
use App\Models\MarketingCoupon;
use App\Models\Product;
use App\Models\Report;
use App\Models\Role;
use App\Models\SiteContent;
use App\Models\SiteSetting;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\SystemLog;
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
        $business = Business::firstOrCreate(
            ['slug' => 'rehab-qr'],
            [
                'name' => 'Rehab QR',
                'email' => 'info@rehab-qr.com',
                'phone' => '+966556023195',
                'country' => 'Saudi Arabia',
                'city' => 'Riyadh',
                'currency' => 'SAR',
                'theme_primary' => '#3b82f6',
                'theme_secondary' => '#111827',
            ]
        );

        $this->call([
            RolePermissionSeeder::class,
            AdminUserSeeder::class,
            ControlPanelUserSeeder::class,
        ]);

        $admin = User::where('email', 'admin@rehab-qr.com')->firstOrFail();
        $merchant = User::where('email', 'merchant@rehab-qr.com')->firstOrFail();
        $merchantRoleId = Role::where('slug', 'merchant')->value('id');
        $staffRoleId = Role::where('slug', 'staff')->value('id');

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
            SubscriptionPlan::updateOrCreate(['slug' => $plan['slug']], $plan);
        }

        $planRecords = SubscriptionPlan::all()->keyBy('slug');

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
            Card::updateOrCreate(
                ['card_code' => $cardData['card_code']],
                [
                    ...$cardData,
                    'business_id' => $business->id,
                    'created_by' => $merchant->id,
                ]
            );
        }

        $customersData = [
            ['name' => 'توفيق حسن لغبي', 'phone' => '+966055180666'],
            ['name' => 'مداوي القحطاني', 'phone' => '+966580005528'],
            ['name' => 'سعيد', 'phone' => '+966551047087'],
            ['name' => 'ابو حاتم', 'phone' => '+966569941511'],
        ];

        $customers = collect($customersData)->map(function ($customer) use ($business) {
            return Customer::updateOrCreate(
                ['phone' => $customer['phone']],
                [
                    'name' => $customer['name'],
                    'business_id' => $business->id,
                    'language' => 'ar',
                    'loyalty_points' => rand(0, 200),
                    'last_visit_at' => now()->subDays(rand(1, 10)),
                ]
            );
        });

        $cardRecords = Card::all();
        foreach ($customers as $index => $customer) {
            foreach ($cardRecords as $card) {
                CardCustomer::updateOrCreate(
                    [
                        'card_id' => $card->id,
                        'customer_id' => $customer->id,
                    ],
                    [
                        'issue_date' => now()->subDays(5),
                        'expiry_date' => now()->addMonths(6),
                        'current_stage' => $index + 1,
                        'total_stages' => $card->total_stages,
                        'available_rewards' => $index % 2,
                        'redeemed_rewards' => $index === 0 ? 1 : 0,
                        'status' => 'active',
                    ]
                );
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
            Product::updateOrCreate(
                ['sku' => $product['sku']],
                [
                    ...$product,
                    'business_id' => $business->id,
                    'currency' => 'SAR',
                ]
            );
        }

        foreach ($customers as $customer) {
            foreach ($cardRecords as $card) {
                // create 3 recent transactions per card/customer
                for ($i = 1; $i <= 3; $i++) {
                    Transaction::create([
                        'business_id' => $business->id,
                        'card_id' => $card->id,
                        'customer_id' => $customer->id,
                        'type' => 'stamp_awarded',
                        'amount' => 0,
                        'currency' => 'SAR',
                        'reference' => $card->card_code,
                        'note' => "إضافة ختم رقم {$i} للعميل {$customer->name}",
                        'happened_at' => now()->subDays($i + rand(0, 2)),
                        'scanned_by' => $merchant->id,
                    ]);
                }
            }
        }

        Subscription::updateOrCreate(
            ['business_id' => $business->id],
            [
                'subscription_plan_id' => $planRecords['business']->id,
                'status' => 'active',
                'amount' => $planRecords['business']->price,
                'currency' => 'SAR',
                'auto_renew' => true,
                'payment_method' => 'بطاقة ائتمان',
                'started_at' => now()->subYear(),
                'ends_at' => now()->addMonths(3),
                'last_payment_at' => now()->subMonth(),
                'next_payment_at' => now()->addMonth(),
                'total_paid' => $planRecords['business']->price * 12,
            ]
        );

        $demoBusinesses = [
            [
                'name' => 'مقهى النخيل',
                'slug' => 'palm-cafe',
                'email' => 'contact@palmtreecafe.com',
                'phone' => '+966501234560',
                'city' => 'Riyadh',
                'plan' => 'business',
                'owner' => [
                    'name' => 'أحمد محمد',
                    'email' => 'owner-palm@rehabsa.com',
                    'phone' => '+966501234567',
                ],
                'subscription' => [
                    'status' => 'active',
                    'amount' => 299,
                    'auto_renew' => true,
                    'started_at' => now()->subMonths(10),
                    'ends_at' => now()->addMonth(),
                    'last_payment_at' => now()->subWeeks(2),
                    'next_payment_at' => now()->addWeeks(2),
                    'total_paid' => 3588,
                ],
                'customers' => [
                    ['name' => 'محمد أحمد', 'phone' => '+966500000001'],
                    ['name' => 'فاطمة علي', 'phone' => '+966500000002'],
                    ['name' => 'خالد السعد', 'phone' => '+966500000003'],
                ],
                'transactions' => [1250, 1380, 1120, 980, 1460],
            ],
            [
                'name' => 'صالون الجمال',
                'slug' => 'beauty-salon',
                'email' => 'care@beautysalon.com',
                'phone' => '+966502345670',
                'city' => 'Jeddah',
                'plan' => 'basic',
                'owner' => [
                    'name' => 'فاطمة أحمد',
                    'email' => 'owner-beauty@rehabsa.com',
                    'phone' => '+966502345678',
                ],
                'subscription' => [
                    'status' => 'active',
                    'amount' => 199,
                    'auto_renew' => true,
                    'started_at' => now()->subMonths(5),
                    'ends_at' => now()->addMonths(5),
                    'last_payment_at' => now()->subWeeks(3),
                    'next_payment_at' => now()->addWeeks(1),
                    'total_paid' => 995,
                ],
                'customers' => [
                    ['name' => 'نورا السعيد', 'phone' => '+966510000001'],
                    ['name' => 'لمياء الحسن', 'phone' => '+966510000002'],
                ],
                'transactions' => [890, 920, 760, 640],
            ],
            [
                'name' => 'مطعم الشرق',
                'slug' => 'east-restaurant',
                'email' => 'info@eastrestaurant.com',
                'phone' => '+966503456780',
                'city' => 'Dammam',
                'plan' => 'business',
                'owner' => [
                    'name' => 'محمد علي',
                    'email' => 'owner-east@rehabsa.com',
                    'phone' => '+966503456789',
                ],
                'subscription' => [
                    'status' => 'active',
                    'amount' => 499,
                    'auto_renew' => true,
                    'started_at' => now()->subYear(),
                    'ends_at' => now()->addMonths(6),
                    'last_payment_at' => now()->subWeeks(4),
                    'next_payment_at' => now()->addWeeks(4),
                    'total_paid' => 5988,
                ],
                'customers' => [
                    ['name' => 'بندر العتيبي', 'phone' => '+966520000001'],
                    ['name' => 'عبير المالكي', 'phone' => '+966520000002'],
                    ['name' => 'تركي الحربي', 'phone' => '+966520000003'],
                    ['name' => 'مشاعل الشمراني', 'phone' => '+966520000004'],
                ],
                'transactions' => [2100, 1980, 1560, 1875, 2230, 1995],
            ],
            [
                'name' => 'صالة الرياضة المتكاملة',
                'slug' => 'gym-pro',
                'email' => 'support@gympro.com',
                'phone' => '+966504567890',
                'city' => 'Mecca',
                'plan' => 'business',
                'owner' => [
                    'name' => 'خالد السعد',
                    'email' => 'owner-gym@rehabsa.com',
                    'phone' => '+966504567890',
                ],
                'subscription' => [
                    'status' => 'expired',
                    'amount' => 299,
                    'auto_renew' => false,
                    'started_at' => now()->subMonths(14),
                    'ends_at' => now()->subWeeks(2),
                    'last_payment_at' => now()->subMonths(2),
                    'next_payment_at' => null,
                    'total_paid' => 2688,
                ],
                'customers' => [
                    ['name' => 'أيمن الشهراني', 'phone' => '+966530000001'],
                    ['name' => 'علي العمري', 'phone' => '+966530000002'],
                ],
                'transactions' => [1560, 1380, 1420],
            ],
        ];

        foreach ($demoBusinesses as $store) {
            $biz = Business::updateOrCreate(
                ['slug' => $store['slug']],
                [
                    'name' => $store['name'],
                    'email' => $store['email'],
                    'phone' => $store['phone'],
                    'city' => $store['city'],
                    'country' => 'Saudi Arabia',
                    'currency' => 'SAR',
                ]
            );

            $owner = User::updateOrCreate(
                ['email' => $store['owner']['email']],
                [
                    'name' => $store['owner']['name'],
                    'phone' => $store['owner']['phone'],
                    'role' => 'merchant',
                    'password' => Hash::make('password123'),
                    'business_id' => $biz->id,
                ]
            );

            if ($merchantRoleId) {
                $owner->roles()->syncWithoutDetaching([$merchantRoleId]);
            }

            $plan = $planRecords[$store['plan']] ?? $planRecords->first();

            Subscription::updateOrCreate(
                ['business_id' => $biz->id],
                [
                    'subscription_plan_id' => $plan->id,
                    'status' => $store['subscription']['status'],
                    'amount' => $store['subscription']['amount'],
                    'currency' => 'SAR',
                    'auto_renew' => $store['subscription']['auto_renew'],
                    'payment_method' => 'بطاقة ائتمان',
                    'started_at' => $store['subscription']['started_at'],
                    'ends_at' => $store['subscription']['ends_at'],
                    'last_payment_at' => $store['subscription']['last_payment_at'],
                    'next_payment_at' => $store['subscription']['next_payment_at'],
                    'total_paid' => $store['subscription']['total_paid'],
                ]
            );

            $card = Card::updateOrCreate(
                ['business_id' => $biz->id, 'name' => "{$store['name']} بطاقة الولاء"],
                [
                    'title' => 'برنامج الولاء الذكي',
                    'description' => 'بطاقة مكافآت رقمية',
                    'card_code' => strtoupper(Str::random(12)),
                    'issue_date' => now()->subMonths(2),
                    'expiry_date' => now()->addYear(),
                    'bg_color' => '#3498DB',
                    'bg_opacity' => 0.9,
                    'text_color' => '#ffffff',
                    'status' => 'active',
                    'current_stage' => 1,
                    'total_stages' => 5,
                    'created_by' => $owner->id,
                ]
            );

            $customerCollection = collect($store['customers'])->map(function ($customer) use ($biz) {
                return Customer::updateOrCreate(
                    ['phone' => $customer['phone']],
                    [
                        'name' => $customer['name'],
                        'business_id' => $biz->id,
                        'language' => 'ar',
                        'loyalty_points' => rand(10, 80),
                        'last_visit_at' => now()->subDays(rand(1, 30)),
                    ]
                );
            });

            foreach ($customerCollection as $index => $customer) {
                CardCustomer::updateOrCreate(
                    [
                        'card_id' => $card->id,
                        'customer_id' => $customer->id,
                    ],
                    [
                        'issue_date' => now()->subMonths(2),
                        'expiry_date' => now()->addMonths(10),
                        'current_stage' => $index + 1,
                        'total_stages' => 5,
                        'available_rewards' => $index % 2,
                        'redeemed_rewards' => $index === 0 ? 1 : 0,
                        'status' => 'active',
                    ]
                );
            }

            foreach ($store['transactions'] as $amount) {
                $customer = $customerCollection->random();
                Transaction::create([
                    'business_id' => $biz->id,
                    'customer_id' => $customer->id,
                    'card_id' => $card->id,
                    'type' => 'purchase',
                    'amount' => $amount,
                    'currency' => 'SAR',
                    'note' => 'عملية بيع عبر لوحة التحكم',
                    'happened_at' => now()->subDays(rand(1, 25)),
                ]);
            }
        }

        $blogCategories = [
            'business' => BlogCategory::updateOrCreate(
                ['slug' => 'business-management'],
                [
                    'name_ar' => 'إدارة الأعمال',
                    'name_en' => 'Business Management',
                    'description_ar' => 'مقالات حول إدارة المتاجر ونمو الأعمال',
                    'description_en' => 'Articles about store management and growth',
                    'color' => '#3B82F6',
                ]
            ),
            'marketing' => BlogCategory::updateOrCreate(
                ['slug' => 'digital-marketing'],
                [
                    'name_ar' => 'التسويق الرقمي',
                    'name_en' => 'Digital Marketing',
                    'description_ar' => 'نصائح التسويق والحملات',
                    'description_en' => 'Marketing tips and campaigns',
                    'color' => '#10B981',
                ]
            ),
            'technology' => BlogCategory::updateOrCreate(
                ['slug' => 'technology'],
                [
                    'name_ar' => 'التقنية',
                    'name_en' => 'Technology',
                    'description_ar' => 'مقالات تقنية وشروحات',
                    'description_en' => 'Technology articles and guides',
                    'color' => '#F59E0B',
                ]
            ),
        ];

        $blogPosts = [
            [
                'title' => 'أفضل الممارسات في إدارة المتاجر الإلكترونية',
                'slug' => 'best-ecommerce-practices',
                'excerpt' => 'تعرف على طرق تحسين تجربة العملاء وزيادة المبيعات في متجرك.',
                'content' => 'في عالم التجارة الإلكترونية...',
                'category' => 'business',
                'views' => 1250,
                'likes' => 89,
                'is_featured' => true,
                'comments' => [
                    ['author' => 'محمد علي', 'email' => 'mohammed@example.com', 'status' => 'approved'],
                    ['author' => 'فاطمة أحمد', 'email' => 'fatima@example.com', 'status' => 'pending'],
                ],
            ],
            [
                'title' => 'دليل شامل لتحسين محركات البحث SEO',
                'slug' => 'advanced-seo-guide',
                'excerpt' => 'كل ما تحتاج معرفته عن تحسين ظهور موقعك في نتائج البحث.',
                'content' => 'تحسين محركات البحث عنصر أساسي...',
                'category' => 'marketing',
                'views' => 980,
                'likes' => 56,
                'is_featured' => true,
                'comments' => [
                    ['author' => 'نواف الدوسري', 'email' => 'nawaf@example.com', 'status' => 'approved'],
                ],
            ],
            [
                'title' => 'أساسيات الأمان في المواقع الإلكترونية',
                'slug' => 'web-security-basics',
                'excerpt' => 'كيف تحمي بيانات عملائك وتضمن ثقتهم.',
                'content' => 'الأمان السيبراني ضرورة لكل مشروع رقمي...',
                'category' => 'technology',
                'views' => 450,
                'likes' => 22,
                'is_featured' => false,
                'comments' => [],
            ],
        ];

        foreach ($blogPosts as $postData) {
            $post = BlogPost::updateOrCreate(
                ['slug' => $postData['slug']],
                [
                    'author_id' => $admin->id,
                    'category_id' => $blogCategories[$postData['category']]->id,
                    'title' => $postData['title'],
                    'excerpt' => $postData['excerpt'],
                    'content' => $postData['content'],
                    'status' => 'published',
                    'published_at' => now()->subDays(rand(1, 10)),
                    'tags' => ['loyalty', 'stores'],
                    'views_count' => $postData['views'],
                    'likes_count' => $postData['likes'],
                    'is_featured' => $postData['is_featured'],
                ]
            );

            foreach ($postData['comments'] as $comment) {
                BlogComment::updateOrCreate(
                    [
                        'blog_post_id' => $post->id,
                        'author_email' => $comment['email'],
                    ],
                    [
                        'author_name' => $comment['author'],
                        'content' => 'شكراً على المحتوى القيم!',
                        'status' => $comment['status'],
                        'likes' => rand(0, 10),
                        'replies_count' => rand(0, 3),
                    ]
                );
            }
        }

        $couponData = [
            [
                'code' => 'SAVE20',
                'type' => 'percentage',
                'value' => 20,
                'min_purchase_amount' => 100,
                'usage_count' => 245,
                'max_usage' => 1000,
                'status' => 'active',
                'starts_at' => now()->subMonths(2),
                'ends_at' => now()->addMonths(6),
                'total_savings' => 12450,
            ],
            [
                'code' => 'WELCOME50',
                'type' => 'fixed',
                'value' => 50,
                'min_purchase_amount' => 200,
                'usage_count' => 189,
                'max_usage' => 500,
                'status' => 'active',
                'starts_at' => now()->subMonths(6),
                'ends_at' => now()->addMonths(2),
                'total_savings' => 9450,
            ],
            [
                'code' => 'FLASH25',
                'type' => 'percentage',
                'value' => 25,
                'min_purchase_amount' => 50,
                'usage_count' => 1234,
                'max_usage' => 2000,
                'status' => 'active',
                'starts_at' => now()->subMonth(),
                'ends_at' => now()->addMonths(2),
                'total_savings' => 61700,
            ],
        ];

        $couponRecords = [];
        foreach ($couponData as $coupon) {
            $couponRecords[$coupon['code']] = MarketingCoupon::updateOrCreate(
                ['code' => $coupon['code']],
                $coupon
            );
        }

        $campaignData = [
            [
                'name' => 'حملة الصيف الكبيرة',
                'description' => 'خصومات صيفية على جميع الخدمات',
                'status' => 'active',
                'target_audience' => 'جميع العملاء',
                'starts_at' => now()->subMonth(),
                'ends_at' => now()->addMonths(2),
                'conversions' => 890,
                'roi_percentage' => 245,
                'total_spent' => 15000,
                'total_revenue' => 52250,
                'coupons' => ['SAVE20', 'FLASH25'],
            ],
            [
                'name' => 'ترحيب بالعملاء الجدد',
                'description' => 'عروض خاصة للمشتركين الجدد',
                'status' => 'finished',
                'target_audience' => 'عملاء جدد',
                'starts_at' => now()->subMonths(8),
                'ends_at' => now()->subMonth(),
                'conversions' => 234,
                'roi_percentage' => 180,
                'total_spent' => 8000,
                'total_revenue' => 22400,
                'coupons' => ['WELCOME50'],
            ],
        ];

        foreach ($campaignData as $campaign) {
            $record = MarketingCampaign::updateOrCreate(
                ['name' => $campaign['name']],
                [
                    'description' => $campaign['description'],
                    'status' => $campaign['status'],
                    'target_audience' => $campaign['target_audience'],
                    'starts_at' => $campaign['starts_at'],
                    'ends_at' => $campaign['ends_at'],
                    'conversions' => $campaign['conversions'],
                    'roi_percentage' => $campaign['roi_percentage'],
                    'total_spent' => $campaign['total_spent'],
                    'total_revenue' => $campaign['total_revenue'],
                ]
            );

            $record->coupons()->sync(
                collect($campaign['coupons'])
                    ->map(fn ($code) => $couponRecords[$code]->id)
                    ->toArray()
            );
        }

        $logEntries = [
            ['level' => 'info', 'category' => 'Authentication', 'message' => 'تم تسجيل دخول المشرف بنجاح', 'user_name' => 'مسؤول النظام', 'store_name' => 'لوحة التحكم', 'ip' => '192.168.1.10'],
            ['level' => 'warning', 'category' => 'Payment', 'message' => 'بطء في معالجة دفعة الاشتراك', 'user_name' => 'مقهى النخيل', 'store_name' => 'مقهى النخيل', 'ip' => '192.168.1.11'],
            ['level' => 'error', 'category' => 'API', 'message' => 'تجاوز حد واجهة برمجة التطبيقات', 'user_name' => 'صالة الرياضة', 'store_name' => 'صالة الرياضة', 'ip' => '192.168.1.12'],
            ['level' => 'success', 'category' => 'Backup', 'message' => 'تم إنشاء نسخة احتياطية يومية', 'user_name' => 'النظام', 'store_name' => 'لوحة التحكم', 'ip' => '127.0.0.1'],
        ];

        foreach ($logEntries as $entry) {
            SystemLog::create([
                'level' => $entry['level'],
                'category' => $entry['category'],
                'message' => $entry['message'],
                'user_name' => $entry['user_name'],
                'store_name' => $entry['store_name'],
                'ip_address' => $entry['ip'],
            ]);
        }

        $adminSettings = [
            'general' => [
                'siteName' => 'رحاب - نظام إدارة بطاقات الولاء',
                'siteDescription' => 'منصة متقدمة لإدارة بطاقات الولاء الرقمية',
                'defaultLanguage' => 'ar',
                'timezone' => 'Asia/Riyadh',
            ],
            'admin' => [
                'adminName' => 'المسؤول الأعلى',
                'adminEmail' => 'admin@rehabsa.com',
                'adminPhone' => '+966501234567',
            ],
            'security' => [
                'enableTwoFactor' => true,
                'sessionTimeout' => 30,
                'maxLoginAttempts' => 5,
                'passwordMinLength' => 8,
            ],
            'notifications' => [
                'emailNotifications' => true,
                'smsNotifications' => false,
                'pushNotifications' => true,
            ],
            'system' => [
                'maintenanceMode' => false,
                'debugMode' => false,
                'autoBackup' => true,
                'backupFrequency' => 'daily',
            ],
            'email' => [
                'smtpHost' => 'smtp.gmail.com',
                'smtpPort' => 587,
                'smtpUsername' => 'noreply@rehabsa.com',
                'smtpPassword' => '********',
                'smtpSecure' => true,
            ],
            'sms' => [
                'smsProvider' => 'twilio',
                'smsApiKey' => '********',
                'smsApiSecret' => '********',
            ],
        ];

        SiteSetting::updateOrCreate(
            ['group' => 'admin_settings'],
            ['settings' => $adminSettings]
        );

        $seoSettings = [
            'general' => [
                'siteName' => 'Rehabsa',
                'siteDescription' => 'منصة إدارة المتاجر والمشاريع التجارية',
                'siteDescriptionEn' => 'Store management platform',
                'siteUrl' => 'https://rehabsa.com',
                'siteLanguage' => 'ar',
            ],
            'metaTags' => [
                'title' => 'Rehabsa - منصة إدارة المتاجر',
                'description' => 'حلول إدارة متكاملة للمتاجر والعملاء',
                'keywords' => 'إدارة متاجر, ولاء العملاء, حلول سحابية',
                'author' => 'Rehabsa Team',
            ],
            'sitemap' => [
                'enabled' => true,
                'lastModified' => now()->toDateString(),
                'changeFrequency' => 'weekly',
                'priority' => 0.8,
            ],
            'analytics' => [
                'googleAnalytics' => [
                    'enabled' => true,
                    'trackingId' => 'GA-XXXXXXX',
                ],
                'facebookPixel' => [
                    'enabled' => false,
                    'pixelId' => null,
                ],
            ],
        ];

        SiteSetting::updateOrCreate(
            ['group' => 'seo'],
            ['settings' => $seoSettings]
        );

        $themeSettings = [
            'logos' => [
                'website' => '/Logo.svg',
                'admin' => '/Logo.svg',
                'dashboard' => '/Logo.svg',
            ],
            'colors' => [
                'website' => [
                    'primary' => '180 100% 40%',
                    'primaryForeground' => '0 0% 100%',
                    'secondary' => '210 35% 45%',
                    'secondaryForeground' => '0 0% 100%',
                    'accent' => '180 100% 40%',
                    'accentForeground' => '0 0% 100%',
                    'background' => '0 0% 100%',
                    'foreground' => '220 50% 20%',
                    'card' => '0 0% 100%',
                    'cardForeground' => '220 50% 20%',
                    'border' => '215 20% 85%',
                    'input' => '215 20% 85%',
                    'ring' => '180 100% 40%',
                    'muted' => '215 20% 95%',
                    'mutedForeground' => '215 20% 45%',
                    'destructive' => '0 84% 60%',
                    'destructiveForeground' => '0 0% 98%',
                    'sidebarBackground' => '0 0% 98%',
                    'sidebarForeground' => '220 50% 20%',
                    'sidebarPrimary' => '180 100% 40%',
                    'sidebarPrimaryForeground' => '0 0% 100%',
                    'sidebarAccent' => '215 20% 95%',
                    'sidebarAccentForeground' => '220 50% 20%',
                    'sidebarBorder' => '215 20% 85%',
                    'sidebarRing' => '180 100% 40%',
                ],
                'admin' => [],
                'dashboard' => [],
            ],
        ];

        $themeSettings['colors']['admin'] = $themeSettings['colors']['website'];
        $themeSettings['colors']['dashboard'] = $themeSettings['colors']['website'];

        SiteSetting::updateOrCreate(
            ['group' => 'theme'],
            ['settings' => $themeSettings]
        );

        $siteContent = [
            'hero' => [
                'title' => 'ارفع تجربة عملائك ببطاقات ولاء رقمية',
                'subtitle' => 'منصة سحابية لإدارة الولاء والمكافآت بكل سهولة',
                'cta' => 'جرّب الآن',
                'requestDemo' => 'احجز عرضاً',
            ],
            'features' => [
                'title' => 'مزايا المنصة',
                'items' => [
                    ['key' => 'mobileCompatible', 'title' => 'متوافق مع الجوال', 'description' => 'تجربة متكاملة على جميع الأجهزة'],
                    ['key' => 'realTimeUpdates', 'title' => 'تحديثات فورية', 'description' => 'تابع أداء متجرك مباشرة'],
                ],
            ],
            'howItWorks' => [
                'subtitle' => 'كيف تعمل المنصة',
                'title' => 'خطوات بسيطة للانطلاق',
                'steps' => [
                    ['number' => '01', 'title' => 'أنشئ متجرك', 'description' => 'أدخل بياناتك التجارية'],
                    ['number' => '02', 'title' => 'صمم بطاقتك', 'description' => 'خصص بطاقة الولاء'],
                    ['number' => '03', 'title' => 'ابدأ المكافآت', 'description' => 'تابع مكافآت العملاء'],
                ],
                'imageAlt' => 'لوحة مفاتيح',
            ],
            'cardTypes' => [
                'title' => 'أنواع البطاقات',
                'types' => [
                    ['id' => 'stamps', 'title' => 'ختم المكافآت', 'name' => 'بطاقة الأختام', 'description' => 'للمقاهي والمطاعم'],
                    ['id' => 'points', 'title' => 'نقاط الولاء', 'name' => 'بطاقة النقاط', 'description' => 'للمتاجر والخدمات'],
                ],
            ],
            'benefits' => [
                'title' => 'لماذا تختارنا',
                'items' => [
                    ['key' => 'growth', 'title' => 'زيادة المبيعات', 'description' => 'ارفع معدل الزيارات المتكررة'],
                    ['key' => 'insights', 'title' => 'تحليلات دقيقة', 'description' => 'افهم سلوك العملاء'],
                ],
            ],
            'pricing' => [
                'title' => 'خطط مرنة',
                'subtitle' => 'اختر ما يناسب حجم عملك',
                'mostPopular' => 'الأكثر شعبية',
                'getStarted' => 'ابدأ الآن',
                'contactUs' => 'تواصل معنا',
                'plans' => [
                    ['id' => 'basic', 'name' => 'الأساسية', 'period' => 'شهري', 'price' => '199', 'features' => [['key' => 'cards', 'text' => 'بطاقة واحدة']], 'featured' => false],
                    ['id' => 'business', 'name' => 'المتقدمة', 'period' => 'شهري', 'price' => '299', 'features' => [['key' => 'cards', 'text' => 'ثلاث بطاقات']], 'featured' => true],
                ],
            ],
            'industries' => [
                'subtitle' => 'تناسب مختلف القطاعات',
                'title' => 'حلول للقطاعات المتنوعة',
                'contactButton' => 'تواصل مع المبيعات',
                'items' => [
                    ['key' => 'cafes', 'name' => 'المقاهي'],
                    ['key' => 'beauty', 'name' => 'الصالونات'],
                    ['key' => 'fitness', 'name' => 'الأندية الرياضية'],
                ],
            ],
            'footer' => [
                'description' => 'حلول الولاء الذكية للمتاجر السعودية',
                'quickLinks' => 'روابط سريعة',
                'contactUs' => 'تواصل معنا',
                'followUs' => 'تابعنا',
                'copyright' => '© ' . now()->year . ' Rehabsa',
                'privacyPolicy' => 'سياسة الخصوصية',
                'termsOfService' => 'الشروط والأحكام',
                'cookiePolicy' => 'سياسة الكوكيز',
                'phone' => '+966501234567',
                'email' => 'support@rehabsa.com',
                'address' => 'الرياض - المملكة العربية السعودية',
                'socialLinks' => [
                    ['key' => 'twitter', 'label' => 'تويتر', 'url' => 'https://twitter.com/rehabsa'],
                ],
            ],
            'header' => [
                'logo' => '/Logo.svg',
                'requestDemo' => 'احجز عرضاً',
                'language' => 'العربية',
            ],
        ];

        foreach (['ar', 'en'] as $language) {
            foreach ($siteContent as $section => $content) {
                SiteContent::updateOrCreate(
                    ['language' => $language, 'section' => $section],
                    ['content' => $content]
                );
            }
        }

        $reports = [
            [
                'name' => 'تقرير الإيرادات الشهرية',
                'type' => 'مالي',
                'period' => 'يناير 2025',
                'generated_at' => now()->subDays(2),
                'status' => 'completed',
                'format' => 'pdf',
                'file_size' => '2.3 MB',
            ],
            [
                'name' => 'تقرير نمو المستخدمين',
                'type' => 'تحليلي',
                'period' => 'الربع الأول 2025',
                'generated_at' => now()->subDays(7),
                'status' => 'completed',
                'format' => 'xlsx',
                'file_size' => '1.8 MB',
            ],
            [
                'name' => 'تقرير أداء المتاجر',
                'type' => 'أداء',
                'period' => '2024',
                'generated_at' => now()->subDays(1),
                'status' => 'processing',
                'format' => 'pdf',
                'file_size' => '0 MB',
            ],
        ];

        foreach ($reports as $report) {
            Report::updateOrCreate(
                ['name' => $report['name']],
                $report
            );
        }
    }
}
