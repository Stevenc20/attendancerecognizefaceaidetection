<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SessionController extends Controller
{
    public function index()
    {
        // Get all unique dates where attendance was recorded
        $dates = Attendance::select('date')
            ->distinct()
            ->orderBy('date', 'desc')
            ->take(10)
            ->pluck('date');
        
        $sessions = [];
        
        // Calculate global stats for each date
        foreach ($dates as $date) {
            $attendances = Attendance::where('date', $date)->get();
            $presentCount = $attendances->whereIn('status', ['Present', 'Late'])->count();
            
            $sessions[] = [
                'date' => $date,
                'present_count' => $presentCount,
                'total_recorded' => $attendances->count(),
            ];
        }

        return Inertia::render('admin/sessions/index', [
            'sessions' => $sessions,
        ]);
    }
}
