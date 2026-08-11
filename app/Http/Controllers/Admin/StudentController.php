<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Classroom;
use App\Models\Grade;
use App\Models\Major;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', User::ROLE_STUDENT)
            ->with(['classroom.grade', 'classroom.major']);
            
        if ($request->filled('classroom_id') && $request->classroom_id !== 'all') {
            $query->where('classroom_id', $request->classroom_id);
        }
        
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('nis', 'like', "%{$search}%");
            });
        }

        $students = $query->orderBy('name')->paginate(20)->withQueryString();
            
        $classrooms = Classroom::with(['grade', 'major'])->get();
            
        return Inertia::render('admin/students/index', [
            'students' => $students,
            'classrooms' => $classrooms,
            'filters' => $request->only(['search', 'classroom_id'])
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nis' => 'nullable|string|max:255|unique:'.User::class,
            'nisn' => 'nullable|string|max:255|unique:'.User::class,
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', Rules\Password::defaults()],
            'classroom_id' => 'required|exists:classrooms,id',
        ]);

        User::create([
            'nis' => $request->nis,
            'nisn' => $request->nisn,
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'classroom_id' => $request->classroom_id,
            'role' => User::ROLE_STUDENT,
            'account_status' => User::STATUS_ACTIVE,
        ]);
        
        return redirect()->back()->with('success', 'Student created successfully.');
    }

    public function update(Request $request, User $student)
    {
        if ($student->role !== User::ROLE_STUDENT) {
            abort(403);
        }

        $rules = [
            'nis' => 'nullable|string|max:255|unique:'.User::class.',nis,'.$student->id,
            'nisn' => 'nullable|string|max:255|unique:'.User::class.',nisn,'.$student->id,
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class.',email,'.$student->id,
            'classroom_id' => 'required|exists:classrooms,id',
            'account_status' => 'required|in:'.User::STATUS_ACTIVE.','.User::STATUS_SUSPENDED,
        ];

        if ($request->filled('password')) {
            $rules['password'] = ['required', Rules\Password::defaults()];
        }

        $request->validate($rules);

        $student->nis = $request->nis;
        $student->nisn = $request->nisn;
        $student->name = $request->name;
        $student->email = $request->email;
        $student->classroom_id = $request->classroom_id;
        $student->account_status = $request->account_status;
        
        if ($request->filled('password')) {
            $student->password = Hash::make($request->password);
        }
        
        $student->save();
        
        return redirect()->back()->with('success', 'Student updated successfully.');
    }

    public function destroy(User $student)
    {
        if ($student->role !== User::ROLE_STUDENT) {
            abort(403);
        }

        $student->delete();
        
        return redirect()->back()->with('success', 'Student deleted successfully.');
    }
}
