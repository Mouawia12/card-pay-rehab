<?php

namespace Database\Seeders;

use App\Models\Business;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ControlPanelUserSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
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

        $merchantRole = Role::where('slug', 'merchant')->firstOrFail();
        $staffRole = Role::where('slug', 'staff')->firstOrFail();

        $merchant = User::updateOrCreate(
            ['email' => 'merchant@rehab-qr.com'],
            [
                'name' => 'Shop Owner',
                'phone' => '+966511111111',
                'role' => 'merchant',
                'password' => Hash::make('password123'),
                'business_id' => $business->id,
            ]
        );
        $merchant->roles()->syncWithoutDetaching([$merchantRole->id]);

        $staff = User::updateOrCreate(
            ['email' => 'staff@rehab-qr.com'],
            [
                'name' => 'Branch Manager',
                'phone' => '+966522222222',
                'role' => 'staff',
                'password' => Hash::make('password123'),
                'business_id' => $business->id,
            ]
        );
        $staff->roles()->syncWithoutDetaching([$staffRole->id]);
    }
}
