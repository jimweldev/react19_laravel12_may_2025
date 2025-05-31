<?php

namespace App\Helpers;

use App\Models\User;

class UserHelper {
    public static function getUser($email) {
        return User::where('email', $email)
            ->with('rbac_user_roles.rbac_role.rbac_role_permissions.rbac_permission')
            ->with('user_setting')
            ->first();
    }
}
