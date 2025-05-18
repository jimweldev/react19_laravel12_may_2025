<?php

namespace App\Helpers;

use App\Models\User;

class UserHelper {
    public static function getUser($email) {
        return User::where('email', $email)->first();
    }
}
