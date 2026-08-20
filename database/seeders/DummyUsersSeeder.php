<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DummyUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            ['name' => 'Super Admin', 'email' => 'super@smkn40.id', 'password' => 'password', 'role' => 'super_admin', 'account_status' => 'active'],
            ['name' => 'Admin System', 'email' => 'admin@smkn40.id', 'password' => 'password', 'role' => 'admin', 'account_status' => 'active'],
            ['name' => 'Teacher', 'email' => 'teacher@smkn40.id', 'password' => 'password', 'role' => 'teacher', 'account_status' => 'active'],
            ['name' => 'Student', 'email' => 'student@smkn40.id', 'password' => 'password', 'role' => 'student', 'account_status' => 'active'],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(
                ['email' => $user['email']],
                $user
            );
        }
    }
}
