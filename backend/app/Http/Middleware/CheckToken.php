<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

class CheckToken {
    public function handle(Request $request, Closure $next) {
        try {
            // Check if access token is valid
            $user = JWTAuth::parseToken()
                ->authenticate()
                ->load([
                    'rbac_user_roles:id,user_id,rbac_role_id',
                    'rbac_user_roles.rbac_role:id,label,value',
                    'rbac_user_roles.rbac_role.rbac_role_permissions:id,rbac_role_id,rbac_permission_id',
                    'rbac_user_roles.rbac_role.rbac_role_permissions.rbac_permission:id,label,value'
                ]);

            if ($user) {
                return $next($request);
            }
        } catch (JWTException $e) {
            return response()->json([
                'message' => 'Invalid token',
                'error' => $e->getMessage(),
            ], 401);
        }
    }
}
