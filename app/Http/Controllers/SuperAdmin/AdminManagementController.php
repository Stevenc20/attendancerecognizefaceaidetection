<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class AdminManagementController extends Controller
{
    public function index()
    {
        $admins = User::where('role', User::ROLE_ADMIN)
            ->orderBy('name')
            ->get();
            
        return Inertia::render('super-admin/admins/index', [
            'admins' => $admins,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', Rules\Password::defaults()],
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => User::ROLE_ADMIN,
            'account_status' => User::STATUS_ACTIVE,
        ]);
        
        return redirect()->back()->with('success', 'Admin user created successfully.');
    }

    public function update(Request $request, User $admin)
    {
        if ($admin->role !== User::ROLE_ADMIN) {
            abort(403);
        }

        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class.',email,'.$admin->id,
            'account_status' => 'required|in:'.User::STATUS_ACTIVE.','.User::STATUS_SUSPENDED,
        ];

        if ($request->filled('password')) {
            $rules['password'] = ['required', Rules\Password::defaults()];
        }

        $request->validate($rules);

        $admin->name = $request->name;
        $admin->email = $request->email;
        $admin->account_status = $request->account_status;
        
        if ($request->filled('password')) {
            $admin->password = Hash::make($request->password);
        }
        
        $admin->save();
        
        return redirect()->back()->with('success', 'Admin user updated successfully.');
    }

    public function destroy(User $admin)
    {
        if ($admin->role !== User::ROLE_ADMIN) {
            abort(403);
        }

        $admin->delete();
        
        return redirect()->back()->with('success', 'Admin user deleted successfully.');
    }
}
