<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $roles = [
            'admin' => Role::firstOrCreate(
                ['slug' => 'admin'],
                ['name' => 'Admin', 'description' => 'Full access']
            ),
            'merchant' => Role::firstOrCreate(
                ['slug' => 'merchant'],
                ['name' => 'Merchant', 'description' => 'Store owner']
            ),
            'staff' => Role::firstOrCreate(
                ['slug' => 'staff'],
                ['name' => 'Staff', 'description' => 'Branch staff']
            ),
        ];

        $permissions = [
            'manage_users' => Permission::firstOrCreate(['slug' => 'manage_users'], ['name' => 'Manage Users']),
            'manage_cards' => Permission::firstOrCreate(['slug' => 'manage_cards'], ['name' => 'Manage Cards']),
            'manage_customers' => Permission::firstOrCreate(['slug' => 'manage_customers'], ['name' => 'Manage Customers']),
            'view_reports' => Permission::firstOrCreate(['slug' => 'view_reports'], ['name' => 'View Reports']),
        ];

        $roles['admin']->permissions()->syncWithoutDetaching(collect($permissions)->pluck('id'));
        $roles['merchant']->permissions()->syncWithoutDetaching([
            $permissions['manage_cards']->id,
            $permissions['manage_customers']->id,
            $permissions['view_reports']->id,
        ]);
        $roles['staff']->permissions()->syncWithoutDetaching([
            $permissions['manage_customers']->id,
        ]);
    }
}
