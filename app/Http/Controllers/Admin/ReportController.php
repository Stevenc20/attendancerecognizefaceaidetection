<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Classroom;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        $classrooms = Classroom::with(['teacher', 'grade', 'major'])->get();
        $reports = [];

        // For global report, we aggregate by classroom for the current month
        $currentMonth = now()->month;

        foreach ($classrooms as $class) {
            $students = User::where('role', User::ROLE_STUDENT)->where('classroom_id', $class->id)->pluck('id');
            $totalStudents = $students->count();
            
            if ($totalStudents > 0) {
                // Get unique active dates for this class
                $activeDates = Attendance::whereIn('user_id', $students)
                    ->whereMonth('date', $currentMonth)
                    ->select('date')
                    ->distinct()
                    ->pluck('date');
                
                $totalSessions = $activeDates->count();
                
                if ($totalSessions > 0) {
                    $attendances = Attendance::whereIn('user_id', $students)
                        ->whereIn('date', $activeDates)
                        ->get();
                    
                    $totalPresent = $attendances->whereIn('status', ['Present', 'Late'])->count();
                    // Max possible attendances = total students * total sessions
                    $maxPossible = $totalStudents * $totalSessions;
                    $rate = $maxPossible > 0 ? round(($totalPresent / $maxPossible) * 100) : 0;
                    
                    $reports[] = [
                        'class_id' => $class->id,
                        'class_name' => $class->name,
                        'teacher_name' => $class->teacher ? $class->teacher->name : '-',
                        'total_students' => $totalStudents,
                        'active_sessions' => $totalSessions,
                        'attendance_rate' => $rate
                    ];
                } else {
                    $reports[] = [
                        'class_id' => $class->id,
                        'class_name' => $class->name,
                        'teacher_name' => $class->teacher ? $class->teacher->name : '-',
                        'total_students' => $totalStudents,
                        'active_sessions' => 0,
                        'attendance_rate' => 0
                    ];
                }
            }
        }

        return Inertia::render('admin/reports/index', [
            'reports' => collect($reports)->sortByDesc('attendance_rate')->values()->all()
        ]);
    }
}
