<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SecurityAlert;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AlertController extends Controller
{
    public function index()
    {
        $alerts = SecurityAlert::orderBy('created_at', 'desc')->get();

        return Inertia::render('admin/alerts/index', [
            'alerts' => $alerts,
        ]);
    }

    public function resolve(SecurityAlert $alert)
    {
        $alert->update(['resolved_at' => now()]);
        return back()->with('success', 'Alert resolved successfully');
    }
}
