<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller {
    public function getDashboardAdmins(Request $request) {
        // Get all distinct admin_type and their count from users table
        $adminsCount = User::select('is_admin', DB::raw('count(*) as count'))
            ->groupBy('is_admin')
            ->get();

        // Return as JSON response
        return response()->json($adminsCount);
    }

    public function getDashboardAccountTypes(Request $request) {
        // Get all distinct account_type and their count from users table
        $accountTypesCount = User::select('account_type', DB::raw('count(*) as count'))
            ->groupBy('account_type')
            ->get();

        // Return as JSON response
        return response()->json($accountTypesCount);
    }
}
