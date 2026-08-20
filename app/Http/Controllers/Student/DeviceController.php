<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DeviceController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        // Fetch registered passkeys if any exist
        $passkeys = DB::table('passkeys')
            ->where('user_id', $userId)
            ->get();

        return Inertia::render('student/device/index', [
            'devices' => $passkeys,
        ]);
    }
}
