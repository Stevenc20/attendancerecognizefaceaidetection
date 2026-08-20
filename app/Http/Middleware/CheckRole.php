<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        Log::info('CheckRole debugging:', [
            'user_role' => $user->role,
            'expected_roles' => $roles,
            'url' => $request->url(),
        ]);

        if (! in_array($user->role, $roles)) {
            abort(403, 'Unauthorized access to this section.');
        }

        return $next($request);
    }
}
