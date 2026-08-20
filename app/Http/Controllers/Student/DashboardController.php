<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\FaceEmbedding;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = Auth::id();
        $currentMonth = now()->month;

        $hasEnrolled = FaceEmbedding::where('user_id', $userId)->exists();
        $hasPasskey = DB::table('passkeys')->where('user_id', $userId)->exists();

        // Get this month's stats
        $attendances = Attendance::where('user_id', $userId)
            ->whereMonth('date', $currentMonth)
            ->get();

        $totalPresent = $attendances->where('status', 'Present')->count();
        $totalLate = $attendances->where('status', 'Late')->count();
        $totalAbsent = $attendances->where('status', 'Absent')->count();
        $totalSessions = $totalPresent + $totalLate + $totalAbsent;

        $attendanceRate = $totalSessions > 0 ? round((($totalPresent + $totalLate) / $totalSessions) * 100) : 100;

        // Get today's status
        $todayRecord = Attendance::where('user_id', $userId)
            ->where('date', now()->toDateString())
            ->first();

        // Get recent attendances
        $recentAttendances = Attendance::where('user_id', $userId)
            ->orderBy('date', 'desc')
            ->orderBy('time_in', 'desc')
            ->take(7)
            ->get();

        return Inertia::render('dashboards/student', [
            'hasEnrolled' => $hasEnrolled,
            'hasPasskey' => $hasPasskey,
            'stats' => [
                'present' => $totalPresent,
                'late' => $totalLate,
                'absent' => $totalAbsent,
                'rate' => $attendanceRate,
            ],
            'todayRecord' => $todayRecord,
            'recentAttendances' => $recentAttendances,
        ]);
    }
}
