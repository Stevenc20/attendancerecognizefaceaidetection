<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today()->format('Y-m-d');
        
        $totalStudents = User::where('role', User::ROLE_STUDENT)->count();
        
        // Fetch all attendance for today
        $todayAttendances = Attendance::where('date', $today)->get();
        
        $present = $todayAttendances->where('status', 'Present')->count();
        $late = $todayAttendances->where('status', 'Late')->count();
        $absent = max(0, $totalStudents - $present - $late); // Simple calc for now

        // Format recent activity
        $recentActivityRaw = Attendance::with('user.classroom')
            ->where('date', $today)
            ->latest('time_in')
            ->take(5)
            ->get();

        $recentActivity = $recentActivityRaw->map(function($att) {
            return [
                'time' => Carbon::parse($att->time_in)->format('H:i'),
                'name' => $att->user->name ?? 'Unknown',
                'cls' => ($att->user && $att->user->classroom) ? $att->user->classroom->name : '-',
                'status' => $att->status,
                'method' => $att->method,
            ];
        });

        $metrics = [
            [
                'id' => 'Total Students',
                'value' => number_format($totalStudents),
                'sub' => 'Total enrolled students',
            ],
            [
                'id' => 'Present',
                'value' => number_format($present),
                'sub' => $totalStudents > 0 ? round(($present / $totalStudents) * 100, 1) . '% of total students' : '0%',
            ],
            [
                'id' => 'Late',
                'value' => number_format($late),
                'sub' => $totalStudents > 0 ? round(($late / $totalStudents) * 100, 1) . '% of total students' : '0%',
            ],
            [
                'id' => 'Absent',
                'value' => number_format($absent),
                'sub' => $totalStudents > 0 ? round(($absent / $totalStudents) * 100, 1) . '% of total students' : '0%',
            ],
        ];

        return Inertia::render('dashboards/admin', [
            'metrics' => $metrics,
            'recentActivity' => $recentActivity,
            'activeSessions' => [], // Hidden/empty for now
        ]);
    }
}
