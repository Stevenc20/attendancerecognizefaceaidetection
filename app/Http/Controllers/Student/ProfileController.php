<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function index()
    {
        $user = Auth::user()->load('classroom.teacher');

        return Inertia::render('student/profile/index', [
            'profile' => [
                'name' => $user->name,
                'email' => $user->email,
                'nis' => $user->nis,
                'nisn' => $user->nisn,
                'classroom_name' => $user->classroom ? $user->classroom->name : '-',
                'teacher_name' => ($user->classroom && $user->classroom->teacher) ? $user->classroom->teacher->name : '-',
                'joined_at' => $user->created_at->format('F Y'),
            ],
        ]);
    }
}
