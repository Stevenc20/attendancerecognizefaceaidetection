<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Classroom;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $teacher = Auth::user();

        // Find the classroom where this teacher is the Homeroom Teacher (Wali Kelas)
        $homeroomClass = Classroom::with(['grade', 'major'])
            ->where('teacher_id', $teacher->id)
            ->first();

        $students = collect();
        $dates = [];
        $attendanceMatrix = [];
        $classMetrics = [
            'total_students' => 0,
            'present_today' => 0,
            'absent_today' => 0,
        ];

        if ($homeroomClass) {
            // Get all students in this class
            $students = User::where('role', User::ROLE_STUDENT)
                ->where('classroom_id', $homeroomClass->id)
                ->orderBy('name', 'asc')
                ->get();

            $classMetrics['total_students'] = $students->count();

            // Get the last 7 distinct dates where attendance was recorded for this class
            $dates = Attendance::whereIn('user_id', $students->pluck('id'))
                ->select('date')
                ->distinct()
                ->orderBy('date', 'desc')
                ->take(7)
                ->pluck('date')
                ->reverse()
                ->values()
                ->toArray();

            // If no attendance records yet, let's just generate the last 3 weekdays as placeholders
            if (empty($dates)) {
                $dates = [
                    now()->subDays(2)->format('Y-m-d'),
                    now()->subDays(1)->format('Y-m-d'),
                    now()->format('Y-m-d'),
                ];
            }

            // Fetch actual attendance records for these dates
            $attendances = Attendance::whereIn('user_id', $students->pluck('id'))
                ->whereIn('date', $dates)
                ->get();

            // Calculate today's metrics
            $todayDate = now()->format('Y-m-d');
            $todayAttendances = $attendances->where('date', $todayDate);
            $classMetrics['present_today'] = $todayAttendances->whereIn('status', ['Present', 'present', 'Late', 'late'])->count();
            // Assuming absent if not present/late, but for simplicity we just count missing records as absent
            $classMetrics['absent_today'] = $students->count() - $classMetrics['present_today'];

            // Build the matrix
            foreach ($students as $student) {
                $studentData = [
                    'id' => $student->id,
                    'name' => $student->name,
                    'nis' => $student->nis,
                    'avatar' => $student->avatar,
                    'attendances' => [],
                ];

                foreach ($dates as $date) {
                    $record = $attendances->where('user_id', $student->id)->where('date', $date)->first();
                    $studentData['attendances'][$date] = $record ? ucfirst(strtolower($record->status)) : 'Absent';
                }
                $attendanceMatrix[] = $studentData;
            }
        }

        return Inertia::render('dashboards/teacher', [
            'homeroomClass' => $homeroomClass,
            'dates' => $dates,
            'attendanceMatrix' => $attendanceMatrix,
            'classMetrics' => $classMetrics,
        ]);
    }

    public function updateAttendance(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'status' => 'required|in:Present,Late,Absent',
        ]);

        $teacher = Auth::user();

        // Verify the student belongs to the teacher's homeroom class
        $homeroomClass = Classroom::where('teacher_id', $teacher->id)->first();
        if (! $homeroomClass) {
            return back()->with('error', 'Not authorized');
        }

        $student = User::where('id', $validated['user_id'])
            ->where('classroom_id', $homeroomClass->id)
            ->first();

        if (! $student) {
            return back()->with('error', 'Student not in your homeroom class');
        }

        if ($validated['status'] === 'Absent') {
            // Delete record if marked absent
            Attendance::where('user_id', $student->id)->where('date', $validated['date'])->delete();
        } else {
            // Update or create
            Attendance::updateOrCreate(
                ['user_id' => $student->id, 'date' => $validated['date']],
                [
                    'status' => strtolower($validated['status']),
                    'method' => 'Manual',
                    'time_in' => now()->format('H:i:s'),
                ]
            );
        }

        return back()->with('success', 'Attendance updated');
    }
}
