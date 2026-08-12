<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Classroom;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $teacher = Auth::user();
        $homeroomClass = Classroom::with(['grade', 'major'])
            ->where('teacher_id', $teacher->id)
            ->first();

        $reportData = [];

        if ($homeroomClass) {
            $students = User::where('role', User::ROLE_STUDENT)
                ->where('classroom_id', $homeroomClass->id)
                ->orderBy('name', 'asc')
                ->get();
            
            // Get dates where attendance was recorded for this class in current month
            $dates = Attendance::whereIn('user_id', $students->pluck('id'))
                ->whereMonth('date', now()->month)
                ->select('date')
                ->distinct()
                ->pluck('date');
            
            $totalSessions = count($dates);

            foreach ($students as $student) {
                $attendances = Attendance::where('user_id', $student->id)
                    ->whereIn('date', $dates)
                    ->get();
                
                $presentCount = $attendances->where('status', 'Present')->count();
                $lateCount = $attendances->where('status', 'Late')->count();
                $absentCount = $totalSessions - ($presentCount + $lateCount);
                
                $reportData[] = [
                    'student' => $student,
                    'present' => $presentCount,
                    'late' => $lateCount,
                    'absent' => $absentCount,
                    'total_sessions' => $totalSessions,
                ];
            }
        }

        return Inertia::render('teacher/reports/index', [
            'homeroomClass' => $homeroomClass,
            'reportData' => $reportData,
        ]);
    }
}
