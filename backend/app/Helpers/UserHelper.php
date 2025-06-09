<?php

namespace App\Helpers;

use App\Models\User;

class UserHelper {
    /**
     * Retrieve a user by email with all related roles, permissions, and settings.
     *
     * Eager loads:
     * - rbac_user_roles.rbac_role.rbac_role_permissions.rbac_permission
     * - user_setting
     */
    public static function getUser(string $email): ?User {
        return User::where('email', $email)
            ->with([
                'rbac_user_roles:id,user_id,rbac_role_id',
                'rbac_user_roles.rbac_role:id,label,value',
                'rbac_user_roles.rbac_role.rbac_role_permissions:id,rbac_role_id,rbac_permission_id',
                'rbac_user_roles.rbac_role.rbac_role_permissions.rbac_permission:id,label,value',
                'user_setting'
            ])
            ->first();
    }
}
