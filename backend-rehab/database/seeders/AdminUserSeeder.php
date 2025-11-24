<?php

namespace Database\Seeders;

use App\Models\Business;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): User
    {
        $this->call(RolePermissionSeeder::class);

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

        $adminRole = Role::where('slug', 'admin')->firstOrFail();

        $admin = User::updateOrCreate(
            ['email' => 'admin@rehab-qr.com'],
            [
                'name' => 'Main Admin',
                'phone' => '+966500000000',
                'role' => 'admin',
                'password' => Hash::make('password123'),
                'business_id' => $business->id,
            ]
        );

        $admin->roles()->syncWithoutDetaching([$adminRole->id]);

        return $admin;
    }
}
