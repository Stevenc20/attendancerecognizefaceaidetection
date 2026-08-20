<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Classroom;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SessionController extends Controller
{
    public function index(Request $request)
    {
        $teacher = Auth::user();
        $homeroomClass = Classroom::with(['grade', 'major'])
            ->where('teacher_id', $teacher->id)
            ->first();

        $sessions = [];

        if ($homeroomClass) {
            $students = User::where('role', User::ROLE_STUDENT)
                ->where('classroom_id', $homeroomClass->id)
                ->pluck('id');

            // Get dates where attendance was recorded for this class
            $dates = Attendance::whereIn('user_id', $students)
                ->select('date')
                ->distinct()
                ->orderBy('date', 'desc')
                ->take(10)
                ->pluck('date');

            // For each date, calculate stats
            foreach ($dates as $date) {
                $attendances = Attendance::whereIn('user_id', $students)
                    ->where('date', $date)
                    ->get();

                $presentCount = $attendances->whereIn('status', ['Present', 'present', 'Late', 'late'])->count();
                $absentCount = count($students) - $presentCount;

                $sessions[] = [
                    'date' => $date,
                    'present_count' => $presentCount,
                    'absent_count' => $absentCount,
                    'total_students' => count($students),
                ];
            }
        }

        return Inertia::render('teacher/sessions/index', [
            'homeroomClass' => $homeroomClass,
            'sessions' => $sessions,
        ]);
    }
}
