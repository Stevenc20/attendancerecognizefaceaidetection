<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FaceEmbedding;
use App\Models\Attendance;
use Carbon\Carbon;

class ScannerController extends Controller
{
    public function index()
    {
        return inertia('admin/scanner/index');
    }

    public function fetchEmbeddings()
    {
        $embeddings = FaceEmbedding::with(['user' => function ($query) {
            $query->select('id', 'name', 'avatar', 'classroom_id');
        }, 'user.classroom' => function ($query) {
            $query->select('id', 'name', 'major_id');
        }, 'user.classroom.major' => function ($query) {
            $query->select('id', 'name', 'code');
        }])->get();
        
        return response()->json($embeddings);
    }

    public function recordAttendance(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'method' => 'required|string',
        ]);

        $userId = $request->user_id;
        $today = Carbon::today()->format('Y-m-d');
        $now = Carbon::now();
        $timeIn = $now->format('H:i:s');
        
        // Define late threshold (e.g. 07:15)
        $lateThreshold = Carbon::createFromTime(7, 15, 0);
        $status = $now->greaterThan($lateThreshold) ? 'late' : 'present';

        $attendance = Attendance::firstOrCreate(
            ['user_id' => $userId, 'date' => $today],
            [
                'time_in' => $timeIn,
                'status' => $status,
                'method' => $request->method,
            ]
        );

        if (!$attendance->wasRecentlyCreated) {
            return response()->json([
                'message' => 'Attendance already recorded for today',
                'attendance' => $attendance->load('user.classroom.major')
            ]);
        }

        return response()->json([
            'message' => 'Attendance recorded successfully',
            'attendance' => $attendance->load('user.classroom.major')
        ]);
    }
}
