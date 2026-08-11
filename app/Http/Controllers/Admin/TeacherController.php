<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class TeacherController extends Controller
{
    public function index()
    {
        $teachers = User::where('role', User::ROLE_TEACHER)
            ->orderBy('name')
            ->get();
            
        return Inertia::render('admin/teachers/index', [
            'teachers' => $teachers,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nip' => 'nullable|string|max:255|unique:'.User::class,
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', Rules\Password::defaults()],
        ]);

        User::create([
            'nip' => $request->nip,
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => User::ROLE_TEACHER,
            'account_status' => User::STATUS_ACTIVE,
        ]);
        
        return redirect()->back()->with('success', 'Teacher created successfully.');
    }

    public function update(Request $request, User $teacher)
    {
        if ($teacher->role !== User::ROLE_TEACHER) {
            abort(403);
        }

        $rules = [
            'nip' => 'nullable|string|max:255|unique:'.User::class.',nip,'.$teacher->id,
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class.',email,'.$teacher->id,
            'account_status' => 'required|in:'.User::STATUS_ACTIVE.','.User::STATUS_SUSPENDED,
        ];

        if ($request->filled('password')) {
            $rules['password'] = ['required', Rules\Password::defaults()];
        }

        $request->validate($rules);

        $teacher->nip = $request->nip;
        $teacher->name = $request->name;
        $teacher->email = $request->email;
        $teacher->account_status = $request->account_status;
        
        if ($request->filled('password')) {
            $teacher->password = Hash::make($request->password);
        }
        
        $teacher->save();
        
        return redirect()->back()->with('success', 'Teacher updated successfully.');
    }

    public function destroy(User $teacher)
    {
        if ($teacher->role !== User::ROLE_TEACHER) {
            abort(403);
        }

        $teacher->delete();
        
        return redirect()->back()->with('success', 'Teacher deleted successfully.');
    }
}
