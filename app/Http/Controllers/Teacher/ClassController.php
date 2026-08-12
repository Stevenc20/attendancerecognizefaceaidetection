<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ClassController extends Controller
{
    public function index(Request $request)
    {
        $teacher = Auth::user();
        $homeroomClass = Classroom::with(['grade', 'major'])
            ->where('teacher_id', $teacher->id)
            ->first();

        $students = [];
        if ($homeroomClass) {
            $students = User::where('role', User::ROLE_STUDENT)
                ->where('classroom_id', $homeroomClass->id)
                ->orderBy('name', 'asc')
                ->get();
        }

        return Inertia::render('teacher/classes/index', [
            'homeroomClass' => $homeroomClass,
            'students' => $students,
        ]);
    }
}
