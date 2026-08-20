<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckActivation
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // If user is authenticated and their account status is pending_activation
        if ($user && $user->account_status === User::STATUS_PENDING_ACTIVATION) {
            // Exclude routes that they are allowed to access (activation route and logout)
            if (! $request->routeIs('activation.*') && ! $request->routeIs('logout')) {
                // If they try to access api or Inertia requests, we can also handle it differently,
                // but for web routes, we redirect to activation page.
                return redirect()->route('activation.index');
            }
        }

        return $next($request);
    }
}
