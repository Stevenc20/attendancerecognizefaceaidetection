<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Middleware\EnsureTeamMembership;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    // Get unique base major codes (removing numbers, e.g. DKV 1 -> DKV)
    $majors = \App\Models\Major::all()
        ->map(function ($major) {
            $base = trim(preg_replace('/[0-9]+/', '', $major->code));
            
            // Normalize known duplicates from dummy data vs real data
            if (in_array($base, ['RPL/PPLG', 'RPL'])) $base = 'RPL';
            if (in_array($base, ['AKL', 'A'])) $base = 'AKL';
            if (in_array($base, ['MPLB', 'MP'])) $base = 'MPLB';
            if (in_array($base, ['Bisnis Ritel', 'BR'])) $base = 'Bisnis Ritel';
            
            $major->base_code = $base;
            return $major;
        })
        ->unique('base_code')
        ->values()
        ->map(function ($major, $index) {
            $images = [
                'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1000&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1000&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000&auto=format&fit=crop',
            ];
            return [
                'id' => str_pad($index + 1, 2, '0', STR_PAD_LEFT),
                'title' => $major->base_code,
                'desc' => ucwords(strtolower(trim(preg_replace('/[0-9]+/', '', $major->name)))),
                'img' => $images[$index % count($images)],
            ];
        });

    return inertia('welcome', [
        'majors' => $majors
    ]);
})->name('home');

// Activation Route (Phase 6)
Route::middleware(['auth'])->group(function () {
    Route::get('/activation', function () {
        return "Activation Page - Phase 6 Todo";
    })->name('activation.index');
});

// Role-Based Dashboards
Route::middleware(['auth', 'verified', \App\Http\Middleware\CheckActivation::class])->group(function () {
    
    // Generic Dashboard Redirector (handles Laravel's default /dashboard redirects)
    Route::get('/dashboard', function (\Illuminate\Http\Request $request) {
        $role = $request->user()->role;
        return match ($role) {
            'super_admin' => redirect()->route('super-admin.dashboard'),
            'admin' => redirect()->route('admin.dashboard'),
            'teacher' => redirect()->route('teacher.dashboard'),
            'student' => redirect()->route('student.dashboard'),
            default => abort(403),
        };
    })->name('dashboard');

    // Student Dashboard
    Route::middleware(['role:student'])->group(function () {
        Route::get('/student/dashboard', function () {
            $hasEnrolled = \App\Models\FaceEmbedding::where('user_id', \Illuminate\Support\Facades\Auth::id())->exists();
            return inertia('dashboards/student', [
                'hasEnrolled' => $hasEnrolled
            ]);
        })->name('student.dashboard');
        
        // Face Enrollment
        Route::get('/student/face-enrollment', [\App\Http\Controllers\Student\FaceEnrollmentController::class, 'index'])->name('student.face-enrollment');
        Route::post('/student/face-enrollment', [\App\Http\Controllers\Student\FaceEnrollmentController::class, 'store'])->name('student.face-enrollment.store');
        
        // Modules (Placeholders)
        Route::inertia('/student/history', 'student/history/index')->name('student.history');
        Route::inertia('/student/profile', 'student/profile/index')->name('student.profile');
        Route::inertia('/student/device', 'student/device/index')->name('student.device');
    });

    // Super Admin Dashboard
    Route::middleware(['role:super_admin'])->group(function () {
        Route::get('/super-admin/dashboard', function () {
            return inertia('dashboards/super-admin');
        })->name('super-admin.dashboard');

        // School Setup
        Route::get('/super-admin/schools', [\App\Http\Controllers\SuperAdmin\SchoolSetupController::class, 'index'])->name('super-admin.schools');
        Route::post('/super-admin/schools/classrooms', [\App\Http\Controllers\SuperAdmin\SchoolSetupController::class, 'storeClassroom'])->name('super-admin.classrooms.store');
        Route::delete('/super-admin/schools/classrooms/{classroom}', [\App\Http\Controllers\SuperAdmin\SchoolSetupController::class, 'destroyClassroom'])->name('super-admin.classrooms.destroy');
        Route::post('/super-admin/schools/majors', [\App\Http\Controllers\SuperAdmin\SchoolSetupController::class, 'storeMajor'])->name('super-admin.majors.store');
        Route::put('/super-admin/schools/majors/{major}', [\App\Http\Controllers\SuperAdmin\SchoolSetupController::class, 'updateMajor'])->name('super-admin.majors.update');
        Route::delete('/super-admin/schools/majors/{major}', [\App\Http\Controllers\SuperAdmin\SchoolSetupController::class, 'destroyMajor'])->name('super-admin.majors.destroy');

        // Academic Years
        Route::get('/super-admin/academic-years', [\App\Http\Controllers\SuperAdmin\AcademicYearController::class, 'index'])->name('super-admin.academic-years');
        Route::post('/super-admin/academic-years', [\App\Http\Controllers\SuperAdmin\AcademicYearController::class, 'store'])->name('super-admin.academic-years.store');
        Route::put('/super-admin/academic-years/{academicYear}', [\App\Http\Controllers\SuperAdmin\AcademicYearController::class, 'update'])->name('super-admin.academic-years.update');
        Route::delete('/super-admin/academic-years/{academicYear}', [\App\Http\Controllers\SuperAdmin\AcademicYearController::class, 'destroy'])->name('super-admin.academic-years.destroy');
        Route::put('/super-admin/academic-years/{academicYear}/set-active', [\App\Http\Controllers\SuperAdmin\AcademicYearController::class, 'setActive'])->name('super-admin.academic-years.set-active');
        
        // Admin Management
        Route::get('/super-admin/admins', [\App\Http\Controllers\SuperAdmin\AdminManagementController::class, 'index'])->name('super-admin.admins');
        Route::post('/super-admin/admins', [\App\Http\Controllers\SuperAdmin\AdminManagementController::class, 'store'])->name('super-admin.admins.store');
        Route::put('/super-admin/admins/{admin}', [\App\Http\Controllers\SuperAdmin\AdminManagementController::class, 'update'])->name('super-admin.admins.update');
        Route::delete('/super-admin/admins/{admin}', [\App\Http\Controllers\SuperAdmin\AdminManagementController::class, 'destroy'])->name('super-admin.admins.destroy');
        
        // System Settings
        Route::get('/super-admin/settings', [\App\Http\Controllers\SettingController::class, 'index'])->name('super-admin.settings');
        Route::post('/super-admin/settings', [\App\Http\Controllers\SettingController::class, 'store'])->name('super-admin.settings.store');
    });

    // Admin Dashboard
    Route::middleware(['role:admin,super_admin'])->group(function () {
        Route::get('/admin/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('admin.dashboard');
        
        // Face Scanner (Kiosk)
        Route::get('/admin/scanner', [\App\Http\Controllers\Admin\ScannerController::class, 'index'])->name('admin.scanner.index');
        Route::get('/admin/scanner/embeddings', [\App\Http\Controllers\Admin\ScannerController::class, 'fetchEmbeddings'])->name('admin.scanner.embeddings');
        Route::post('/admin/scanner/attendance', [\App\Http\Controllers\Admin\ScannerController::class, 'recordAttendance'])->name('admin.scanner.attendance');

        // Teacher Management
        Route::get('/admin/teachers', [\App\Http\Controllers\Admin\TeacherController::class, 'index'])->name('admin.teachers');
        Route::post('/admin/teachers', [\App\Http\Controllers\Admin\TeacherController::class, 'store'])->name('admin.teachers.store');
        Route::put('/admin/teachers/{teacher}', [\App\Http\Controllers\Admin\TeacherController::class, 'update'])->name('admin.teachers.update');
        Route::delete('/admin/teachers/{teacher}', [\App\Http\Controllers\Admin\TeacherController::class, 'destroy'])->name('admin.teachers.destroy');
        
        // Student Management
        Route::get('/admin/students', [\App\Http\Controllers\Admin\StudentController::class, 'index'])->name('admin.students');
        Route::post('/admin/students', [\App\Http\Controllers\Admin\StudentController::class, 'store'])->name('admin.students.store');
        Route::put('/admin/students/{student}', [\App\Http\Controllers\Admin\StudentController::class, 'update'])->name('admin.students.update');
        Route::delete('/admin/students/{student}', [\App\Http\Controllers\Admin\StudentController::class, 'destroy'])->name('admin.students.destroy');
        
        // Data Import
        Route::get('/admin/import', [\App\Http\Controllers\Admin\DataImportController::class, 'index'])->name('admin.import');
        Route::post('/admin/import', [\App\Http\Controllers\Admin\DataImportController::class, 'store'])->name('admin.import.store');
        
        // Modules (Placeholders)
        Route::inertia('/admin/sessions', 'admin/sessions/index')->name('admin.sessions');
        Route::inertia('/admin/alerts', 'admin/alerts/index')->name('admin.alerts');
        Route::inertia('/admin/reports', 'admin/reports/index')->name('admin.reports');
    });

    // Teacher Dashboard
    Route::middleware(['role:teacher'])->group(function () {
        Route::get('/teacher/dashboard', [\App\Http\Controllers\Teacher\DashboardController::class, 'index'])->name('teacher.dashboard');
        Route::get('/teacher/classes', [\App\Http\Controllers\Teacher\ClassController::class, 'index'])->name('teacher.classes');
        Route::get('/teacher/sessions', [\App\Http\Controllers\Teacher\SessionController::class, 'index'])->name('teacher.sessions');
        Route::get('/teacher/reports', [\App\Http\Controllers\Teacher\ReportController::class, 'index'])->name('teacher.reports');
    });
});

require __DIR__.'/settings.php';
