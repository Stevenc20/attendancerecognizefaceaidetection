<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        // Default values if not set yet
        $defaultSettings = [
            'school_name' => 'SMKN 40',
            'school_address' => 'Jl. Nanas II Utan Kayu Utara, Matraman, Jakarta Timur',
            'contact_email' => 'info@smkn40.sch.id',
            'attendance_start_time' => '06:00',
            'attendance_late_time' => '07:00',
            'face_recognition_strictness' => 'medium',
        ];

        $currentSettings = array_merge($defaultSettings, $settings);

        return Inertia::render('super-admin/settings/index', [
            'settings' => $currentSettings,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'school_name' => 'required|string|max:255',
            'school_address' => 'required|string|max:500',
            'contact_email' => 'required|email|max:255',
            'attendance_start_time' => 'required|date_format:H:i',
            'attendance_late_time' => 'required|date_format:H:i',
            'face_recognition_strictness' => 'required|in:low,medium,high',
        ]);

        foreach ($validated as $key => $value) {
            Setting::setVal($key, $value);
        }

        return redirect()->back()->with('success', 'System settings updated successfully.');
    }
}
