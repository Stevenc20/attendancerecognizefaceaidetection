<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\Grade;
use App\Models\Major;
use Illuminate\Database\Seeder;

class MasterDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Academic Years
        AcademicYear::insertOrIgnore([
            ['name' => '2025/2026 Ganjil', 'is_active' => false, 'start_date' => '2025-07-15', 'end_date' => '2025-12-20', 'created_at' => now(), 'updated_at' => now()],
            ['name' => '2025/2026 Genap', 'is_active' => false, 'start_date' => '2026-01-05', 'end_date' => '2026-06-25', 'created_at' => now(), 'updated_at' => now()],
            ['name' => '2026/2027 Ganjil', 'is_active' => true, 'start_date' => '2026-07-13', 'end_date' => '2026-12-19', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // 2. Grades
        Grade::insertOrIgnore([
            ['level' => 10, 'name' => 'X', 'created_at' => now(), 'updated_at' => now()],
            ['level' => 11, 'name' => 'XI', 'created_at' => now(), 'updated_at' => now()],
            ['level' => 12, 'name' => 'XII', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // 3. Majors
        Major::insertOrIgnore([
            ['code' => 'RPL/PPLG', 'name' => 'Pengembangan Perangkat Lunak dan Gim', 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'DKV 1', 'name' => 'Desain Komunikasi Visual 1', 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'DKV 2', 'name' => 'Desain Komunikasi Visual 2', 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'AKL', 'name' => 'Akuntansi dan Keuangan Lembaga', 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'MPLB', 'name' => 'Manajemen Perkantoran dan Layanan Bisnis', 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'Bisnis Ritel', 'name' => 'Bisnis Ritel', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
