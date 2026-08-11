<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Major;
use App\Models\Grade;
use App\Models\Classroom;
use Inertia\Inertia;

class SchoolSetupController extends Controller
{
    public function index()
    {
        $majors = Major::orderBy('code')->get();
        $grades = Grade::orderBy('level')->get();
        $classrooms = Classroom::with(['major', 'grade'])
            ->withCount('students')
            ->orderBy('grade_id')
            ->orderBy('major_id')
            ->orderBy('section')
            ->get();

        return Inertia::render('super-admin/school-setup/index', [
            'majors' => $majors,
            'grades' => $grades,
            'classrooms' => $classrooms,
        ]);
    }

    public function storeClassroom(Request $request)
    {
        $validated = $request->validate([
            'grade_id' => 'required|exists:grades,id',
            'major_id' => 'required|exists:majors,id',
            'section' => 'required|string|max:10',
        ]);

        $grade = Grade::find($validated['grade_id']);
        $major = Major::find($validated['major_id']);

        $name = $grade->name . ' ' . $major->code . ' ' . $validated['section'];

        Classroom::create([
            'grade_id' => $grade->id,
            'major_id' => $major->id,
            'section' => $validated['section'],
            'name' => $name,
        ]);

        return redirect()->back()->with('success', 'Classroom created successfully.');
    }

    public function destroyClassroom(Classroom $classroom)
    {
        $classroom->delete();
        return redirect()->back()->with('success', 'Classroom deleted successfully.');
    }

    public function storeMajor(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:majors,code',
            'name' => 'required|string|max:255',
        ]);

        Major::create($validated);
        return redirect()->back()->with('success', 'Major added successfully.');
    }

    public function updateMajor(Request $request, Major $major)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:majors,code,' . $major->id,
            'name' => 'required|string|max:255',
        ]);

        $major->update($validated);
        return redirect()->back()->with('success', 'Major updated successfully.');
    }

    public function destroyMajor(Major $major)
    {
        $major->delete();
        return redirect()->back()->with('success', 'Major deleted successfully.');
    }
}
