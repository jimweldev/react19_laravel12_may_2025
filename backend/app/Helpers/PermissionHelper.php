<?php

namespace App\Helpers;

use App\Models\User;

class PermissionHelper {
    /**
     * Check if the given user has the specified permission.
     */
    public static function hasPermission($user, $permission, $allowAdmin = true): bool {
        // Retrieve the user with all related role and permission data
        $user = User::with('rbac_user_roles.rbac_role.rbac_role_permissions.rbac_permission')
            ->find($user->id);

        // Automatically allow access if the user is an admin and admin bypass is enabled
        if ($allowAdmin && $user->is_admin) {
            return true;
        }

        // Iterate through the user's roles and permissions to check for a match
        foreach ($user->rbac_user_roles as $userRole) {
            $role = $userRole->rbac_role;
            foreach ($role->rbac_role_permissions as $rolePermission) {
                if ($rolePermission->rbac_permission->name === $permission) {
                    return true;
                }
            }
        }

        // Return false if no matching permission was found
        return false;
    }
}
