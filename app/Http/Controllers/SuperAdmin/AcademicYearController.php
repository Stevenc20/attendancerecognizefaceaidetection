<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AcademicYearController extends Controller
{
    public function index()
    {
        $academicYears = AcademicYear::orderBy('start_date', 'desc')->get();
        
        return Inertia::render('super-admin/academic-years/index', [
            'academicYears' => $academicYears,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:academic_years,name',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $validated['is_active'] = false; // New academic years are not active by default

        AcademicYear::create($validated);
        
        return redirect()->back()->with('success', 'Academic Year added successfully.');
    }

    public function update(Request $request, AcademicYear $academicYear)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:academic_years,name,' . $academicYear->id,
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $academicYear->update($validated);
        
        return redirect()->back()->with('success', 'Academic Year updated successfully.');
    }

    public function setActive(AcademicYear $academicYear)
    {
        // Deactivate all
        AcademicYear::query()->update(['is_active' => false]);
        
        // Activate the selected one
        $academicYear->update(['is_active' => true]);
        
        return redirect()->back()->with('success', 'Active Academic Year changed successfully.');
    }

    public function destroy(AcademicYear $academicYear)
    {
        if ($academicYear->is_active) {
            return redirect()->back()->with('error', 'Cannot delete the currently active academic year.');
        }

        $academicYear->delete();
        
        return redirect()->back()->with('success', 'Academic Year deleted successfully.');
    }
}
