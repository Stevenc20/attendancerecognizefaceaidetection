<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HistoryController extends Controller
{
    public function index()
    {
        $history = Attendance::where('user_id', Auth::id())
            ->orderBy('date', 'desc')
            ->orderBy('time_in', 'desc')
            ->get();

        return Inertia::render('student/history/index', [
            'history' => $history
        ]);
    }
}
