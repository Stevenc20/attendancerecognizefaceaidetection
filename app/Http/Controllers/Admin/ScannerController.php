<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\FaceEmbedding;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ScannerController extends Controller
{
    public function index()
    {
        return inertia('admin/scanner/index');
    }

    public function qr()
    {
        return inertia('admin/scanner/qr');
    }

    public function fetchEmbeddings()
    {
        $embeddings = FaceEmbedding::with(['user' => function ($query) {
            $query->select('id', 'name', 'classroom_id');
        }, 'user.classroom' => function ($query) {
            $query->select('id', 'name', 'major_id');
        }, 'user.classroom.major' => function ($query) {
            $query->select('id', 'name', 'code');
        }])->get();

        return response()->json($embeddings);
    }

    public function recordAttendance(Request $request)
    {
        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'user_id' => 'required_without:qr_token|exists:users,id',
            'qr_token' => 'required_without:user_id|exists:users,qr_token',
            'method' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid QR Code',
                'errors' => $validator->errors(),
                'received_token' => $request->qr_token
            ], 422);
        }

        $userId = $request->user_id;
        if ($request->qr_token) {
            $user = User::where('qr_token', $request->qr_token)->firstOrFail();
            $userId = $user->id;
        }
        $today = Carbon::today()->format('Y-m-d');
        $now = Carbon::now();
        $timeIn = $now->format('H:i:s');

        // Define late threshold (06:20 AM)
        $lateThreshold = Carbon::createFromTime(6, 20, 0);
        $status = $now->greaterThan($lateThreshold) ? 'late' : 'present';

        $attendance = Attendance::firstOrCreate(
            ['user_id' => $userId, 'date' => $today],
            [
                'time_in' => $timeIn,
                'status' => $status,
                'method' => $request->method,
            ]
        );

        if (! $attendance->wasRecentlyCreated) {
            return response()->json([
                'message' => 'Attendance already recorded for today',
                'attendance' => $attendance->load('user.classroom.major'),
            ]);
        }

        return response()->json([
            'message' => 'Attendance recorded successfully',
            'attendance' => $attendance->load('user.classroom.major'),
        ]);
    }
}
