<?php

namespace App\Http\Responses;

use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function toResponse($request)
    {
        $user = Auth::user();

        // Check if user is pending activation
        if ($user->account_status === \App\Models\User::STATUS_PENDING_ACTIVATION) {
            return $request->wantsJson()
                    ? response()->json(['two_factor' => false])
                    : redirect()->route('activation.index');
        }

        // Redirect based on role
        $dashboardRoute = match ($user->role) {
            \App\Models\User::ROLE_SUPER_ADMIN => 'super-admin.dashboard',
            \App\Models\User::ROLE_ADMIN => 'admin.dashboard',
            \App\Models\User::ROLE_TEACHER => 'teacher.dashboard',
            \App\Models\User::ROLE_STUDENT => 'dashboard',
            default => 'dashboard',
        };

        return $request->wantsJson()
                    ? response()->json(['two_factor' => false])
                    : redirect()->route($dashboardRoute);
    }
}
