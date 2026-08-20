<?php

use App\Http\Controllers\Admin\AlertController;
use App\Http\Controllers\Admin\DataImportController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\ScannerController;
use App\Http\Controllers\Admin\SessionController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\StudentEnrollmentController;
use App\Http\Controllers\Admin\TeacherController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\Student\DeviceController;
use App\Http\Controllers\Student\FaceEnrollmentController;
use App\Http\Controllers\Student\HistoryController;
use App\Http\Controllers\Student\ProfileController;
use App\Http\Controllers\SuperAdmin\AcademicYearController;
use App\Http\Controllers\SuperAdmin\AdminManagementController;
use App\Http\Controllers\SuperAdmin\SchoolSetupController;
use App\Http\Controllers\Teacher\ClassController;
use App\Http\Middleware\CheckActivation;
use App\Models\Major;
use Illuminate\Auth\Middleware\RequirePassword;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    // Get unique base major codes (removing numbers, e.g. DKV 1 -> DKV)
    $majors = Major::all()
        ->map(function ($major) {
            $base = trim(preg_replace('/[0-9]+/', '', $major->code));

            // Normalize known duplicates from dummy data vs real data
            if (in_array($base, ['RPL/PPLG', 'RPL'])) {
                $base = 'RPL';
            }
            if (in_array($base, ['AKL', 'A'])) {
                $base = 'AKL';
            }
            if (in_array($base, ['MPLB', 'MP'])) {
                $base = 'MPLB';
            }
            if (in_array($base, ['Bisnis Ritel', 'BR'])) {
                $base = 'Bisnis Ritel';
            }

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
        'majors' => $majors,
    ]);
})->name('home');

// Activation Route (Phase 6)
Route::middleware(['auth'])->group(function () {
    Route::get('/activation', function () {
        return 'Activation Page - Phase 6 Todo';
    })->name('activation.index');
});

// Role-Based Dashboards
Route::middleware(['auth', 'verified', CheckActivation::class])->group(function () {

    // Generic Dashboard Redirector (handles Laravel's default /dashboard redirects)
    Route::get('/dashboard', function (Request $request) {
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
        Route::get('/student/dashboard', [App\Http\Controllers\Student\DashboardController::class, 'index'])->name('student.dashboard');

        // Face Enrollment
        Route::get('/student/face-enrollment', [FaceEnrollmentController::class, 'index'])->name('student.face-enrollment');
        Route::post('/student/face-enrollment', [FaceEnrollmentController::class, 'store'])->name('student.face-enrollment.store');

        // Modules
        Route::get('/student/history', [HistoryController::class, 'index'])->name('student.history');
        Route::get('/student/profile', [ProfileController::class, 'index'])->name('student.profile');
        Route::get('/student/device', [DeviceController::class, 'index'])
            ->middleware(RequirePassword::class)
            ->name('student.device');
    });

    // Super Admin Dashboard
    Route::middleware(['role:super_admin'])->group(function () {
        Route::get('/super-admin/dashboard', function () {
            return inertia('dashboards/super-admin');
        })->name('super-admin.dashboard');

        // School Setup
        Route::get('/super-admin/schools', [SchoolSetupController::class, 'index'])->name('super-admin.schools');
        Route::post('/super-admin/schools/classrooms', [SchoolSetupController::class, 'storeClassroom'])->name('super-admin.classrooms.store');
        Route::delete('/super-admin/schools/classrooms/{classroom}', [SchoolSetupController::class, 'destroyClassroom'])->name('super-admin.classrooms.destroy');
        Route::post('/super-admin/schools/majors', [SchoolSetupController::class, 'storeMajor'])->name('super-admin.majors.store');
        Route::put('/super-admin/schools/majors/{major}', [SchoolSetupController::class, 'updateMajor'])->name('super-admin.majors.update');
        Route::delete('/super-admin/schools/majors/{major}', [SchoolSetupController::class, 'destroyMajor'])->name('super-admin.majors.destroy');

        // Academic Years
        Route::get('/super-admin/academic-years', [AcademicYearController::class, 'index'])->name('super-admin.academic-years');
        Route::post('/super-admin/academic-years', [AcademicYearController::class, 'store'])->name('super-admin.academic-years.store');
        Route::put('/super-admin/academic-years/{academicYear}', [AcademicYearController::class, 'update'])->name('super-admin.academic-years.update');
        Route::delete('/super-admin/academic-years/{academicYear}', [AcademicYearController::class, 'destroy'])->name('super-admin.academic-years.destroy');
        Route::put('/super-admin/academic-years/{academicYear}/set-active', [AcademicYearController::class, 'setActive'])->name('super-admin.academic-years.set-active');

        // Admin Management
        Route::get('/super-admin/admins', [AdminManagementController::class, 'index'])->name('super-admin.admins');
        Route::post('/super-admin/admins', [AdminManagementController::class, 'store'])->name('super-admin.admins.store');
        Route::put('/super-admin/admins/{admin}', [AdminManagementController::class, 'update'])->name('super-admin.admins.update');
        Route::delete('/super-admin/admins/{admin}', [AdminManagementController::class, 'destroy'])->name('super-admin.admins.destroy');

        // System Settings
        Route::get('/super-admin/settings', [SettingController::class, 'index'])->name('super-admin.settings');
        Route::post('/super-admin/settings', [SettingController::class, 'store'])->name('super-admin.settings.store');
    });

    // Admin Dashboard
    Route::middleware(['role:admin,super_admin'])->group(function () {
        Route::get('/admin/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('admin.dashboard');

        // Face Scanner (Kiosk)
        Route::get('/admin/scanner', [ScannerController::class, 'index'])->name('admin.scanner.index');
        Route::get('/admin/scanner/embeddings', [ScannerController::class, 'fetchEmbeddings'])->name('admin.scanner.embeddings');
        Route::post('/admin/scanner/attendance', [ScannerController::class, 'recordAttendance'])->name('admin.scanner.attendance');

        // Dedicated QR Scanner
        Route::get('/admin/qr-scanner', [ScannerController::class, 'qr'])->name('admin.scanner.qr');

        // Teacher Management
        Route::get('/admin/teachers', [TeacherController::class, 'index'])->name('admin.teachers');
        Route::post('/admin/teachers', [TeacherController::class, 'store'])->name('admin.teachers.store');
        Route::put('/admin/teachers/{teacher}', [TeacherController::class, 'update'])->name('admin.teachers.update');
        Route::delete('/admin/teachers/{teacher}', [TeacherController::class, 'destroy'])->name('admin.teachers.destroy');

        // Student Management
        Route::get('/admin/students', [StudentController::class, 'index'])->name('admin.students');
        Route::get('/admin/students/print', [StudentController::class, 'print'])->name('admin.students.print');
        Route::post('/admin/students', [StudentController::class, 'store'])->name('admin.students.store');
        Route::put('/admin/students/{student}', [StudentController::class, 'update'])->name('admin.students.update');
        Route::delete('/admin/students/{student}', [StudentController::class, 'destroy'])->name('admin.students.destroy');
        Route::get('/admin/students/{student}/enroll', [StudentEnrollmentController::class, 'index'])->name('admin.students.enroll');
        Route::post('/admin/students/{student}/enroll', [StudentEnrollmentController::class, 'store'])->name('admin.students.enroll.store');

        // Data Import
        Route::get('/admin/import', [DataImportController::class, 'index'])->name('admin.import');
        Route::post('/admin/import', [DataImportController::class, 'store'])->name('admin.import.store');

        // Modules
        Route::get('/admin/sessions', [SessionController::class, 'index'])->name('admin.sessions');
        Route::get('/admin/sessions/{date}', [SessionController::class, 'show'])->where('date', '.*')->name('admin.sessions.show');
        Route::get('/admin/alerts', [AlertController::class, 'index'])->name('admin.alerts');
        Route::post('/admin/alerts', [AlertController::class, 'store'])->name('admin.alerts.store');
        Route::post('/admin/alerts/{alert}/resolve', [AlertController::class, 'resolve'])->name('admin.alerts.resolve');
        Route::get('/admin/reports', [ReportController::class, 'index'])->name('admin.reports');
    });

    // Teacher Dashboard
    Route::middleware(['role:teacher'])->group(function () {
        Route::get('/teacher/dashboard', [App\Http\Controllers\Teacher\DashboardController::class, 'index'])->name('teacher.dashboard');
        Route::post('/teacher/attendance', [App\Http\Controllers\Teacher\DashboardController::class, 'updateAttendance'])->name('teacher.attendance.update');
        Route::get('/teacher/classes', [ClassController::class, 'index'])->name('teacher.classes');
        Route::get('/teacher/sessions', [App\Http\Controllers\Teacher\SessionController::class, 'index'])->name('teacher.sessions');
        Route::get('/teacher/reports', [App\Http\Controllers\Teacher\ReportController::class, 'index'])->name('teacher.reports');
        Route::post('/teacher/signature', [App\Http\Controllers\Teacher\ReportController::class, 'saveSignature'])->name('teacher.signature');
    });
});

require __DIR__.'/settings.php';
