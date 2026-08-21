<?php

namespace App\Http\Responses;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  Request  $request
     * @return Response
     */
    public function toResponse($request)
    {
        $user = Auth::user();

        Log::info('Custom LoginResponse executed for user: '.$user->email);

        // Check if user is pending activation
        if ($user->account_status === User::STATUS_PENDING_ACTIVATION) {
            return $request->wantsJson()
                    ? response()->json(['two_factor' => false])
                    : redirect()->route('activation.index');
        }

        // Redirect based on role
        $dashboardRoute = match ($user->role) {
            User::ROLE_SUPER_ADMIN => 'super-admin.dashboard',
            User::ROLE_ADMIN => 'admin.dashboard',
            User::ROLE_TEACHER => 'teacher.dashboard',
            User::ROLE_STUDENT => 'student.dashboard',
            User::ROLE_PIKET => 'piket.dashboard',
            default => 'dashboard',
        };

        return $request->wantsJson()
                    ? response()->json(['two_factor' => false])
                    : redirect()->route($dashboardRoute);
    }
}
