<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('classroom_id')->nullable()->constrained('classrooms')->nullOnDelete()->after('account_status');
            $table->string('nisn')->unique()->nullable()->after('classroom_id');
            $table->string('nis')->unique()->nullable()->after('nisn');
            $table->string('nip')->unique()->nullable()->after('nis');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['classroom_id']);
            $table->dropColumn(['classroom_id', 'nisn', 'nis', 'nip']);
        });
    }
};
