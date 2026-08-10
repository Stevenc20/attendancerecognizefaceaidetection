<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Middleware\EnsureTeamMembership;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

// Activation Route (Phase 6)
Route::middleware(['auth'])->group(function () {
    Route::get('/activation', function () {
        return "Activation Page - Phase 6 Todo";
    })->name('activation.index');
});

// Role-Based Dashboards
Route::middleware(['auth', 'verified', \App\Http\Middleware\CheckActivation::class])->group(function () {
    
    // Student Dashboard (Default)
    Route::middleware(['role:student'])->group(function () {
        Route::get('/dashboard', function () {
            return inertia('dashboard');
        })->name('dashboard');
    });

    // Super Admin Dashboard
    Route::middleware(['role:super_admin'])->group(function () {
        Route::get('/super-admin/dashboard', function () {
            return inertia('dashboards/super-admin');
        })->name('super-admin.dashboard');
    });

    // Admin Dashboard
    Route::middleware(['role:admin'])->group(function () {
        Route::get('/admin/dashboard', function () {
            return inertia('dashboards/admin');
        })->name('admin.dashboard');
    });

    // Teacher Dashboard
    Route::middleware(['role:teacher'])->group(function () {
        Route::get('/teacher/dashboard', function () {
            return inertia('dashboards/teacher');
        })->name('teacher.dashboard');
    });
});

require __DIR__.'/settings.php';
