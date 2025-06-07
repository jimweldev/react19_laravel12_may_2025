<?php

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller {
    /**
     * Get statistics for the dashboard.
     */
    public function getDashboardStatistics() {
        return response()->json([
            'users' => User::count(),
            'deleted_users' => User::onlyTrashed()->count(),
            'admins' => User::where('is_admin', true)->count(),
            'account_types' => User::distinct('account_type')->count('account_type'),
        ], 200);
    }

    /**
     * Get user registration statistics based on the specified grouping and mode.
     */
    public function getUserRegistrationStats(Request $request) {
        $groupBy = $request->query('group_by', 'month');
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $mode = $request->query('mode', 'periodic');

        $validGroups = ['day', 'week', 'month'];
        $validModes = ['periodic', 'cumulative'];

        // Validate input parameters
        if (!in_array($groupBy, $validGroups)) {
            return response()->json(['error' => 'Invalid group_by value.'], 400);
        }

        if (!in_array($mode, $validModes)) {
            return response()->json(['error' => 'Invalid mode value.'], 400);
        }

        if (!$startDate || !$endDate) {
            return response()->json(['error' => 'start_date and end_date are required.'], 400);
        }

        // Prepare query for user registration stats
        $query = User::query();
        $query->whereDate('created_at', '>=', $startDate)
            ->whereDate('created_at', '<=', $endDate);

        switch ($groupBy) {
            case 'day':
                $selectRaw = 'DATE(created_at) as period';
                break;
            case 'week':
                $selectRaw = 'YEAR(created_at) as year, WEEK(created_at, 1) as week';
                break;
            case 'month':
                $selectRaw = "DATE_FORMAT(created_at, '%Y-%m') as period";
                break;
        }

        $query->selectRaw("COUNT(*) as count, $selectRaw");

        if ($groupBy === 'week') {
            $query->groupBy('year', 'week')->orderBy('year')->orderBy('week');
        } else {
            $query->groupBy('period')->orderBy('period');
        }

        $data = $query->get();
        $start = Carbon::parse($startDate);
        $end = Carbon::parse($endDate);
        $periods = [];

        // Generate periods and calculate statistics
        if ($groupBy === 'day') {
            $period = CarbonPeriod::create($start, '1 day', $end);
            foreach ($period as $date) {
                $periods[$date->format('Y-m-d')] = 0;
            }
            foreach ($data as $item) {
                $periods[$item->period] = $item->count;
            }

            $result = [];
            $cumulative = 0;
            foreach ($periods as $label => $count) {
                $cumulative += $count;
                $result[] = [
                    'label' => $label,
                    'count' => $mode === 'cumulative' ? $cumulative : $count,
                ];
            }
        } elseif ($groupBy === 'month') {
            $period = CarbonPeriod::create($start->copy()->startOfMonth(), '1 month', $end->copy()->endOfMonth());
            foreach ($period as $date) {
                $periods[$date->format('Y-m')] = 0;
            }
            foreach ($data as $item) {
                $periods[$item->period] = $item->count;
            }

            $result = [];
            $cumulative = 0;
            foreach ($periods as $label => $count) {
                $cumulative += $count;
                $result[] = [
                    'label' => $label,
                    'count' => $mode === 'cumulative' ? $cumulative : $count,
                ];
            }
        } else { // week
            $current = $start->copy()->startOfWeek(Carbon::MONDAY);
            $endWeek = $end->copy()->endOfWeek(Carbon::SUNDAY);
            while ($current <= $endWeek) {
                $year = $current->format('o');
                $week = $current->format('W');
                $key = $year.'-'.$week;
                $periods[$key] = ['year' => $year, 'week' => $week, 'count' => 0];
                $current->addWeek();
            }

            foreach ($data as $item) {
                $key = $item->year.'-'.str_pad($item->week, 2, '0', STR_PAD_LEFT);
                if (isset($periods[$key])) {
                    $periods[$key]['count'] = $item->count;
                }
            }

            $result = [];
            $cumulative = 0;
            foreach ($periods as $p) {
                $cumulative += $p['count'];
                $result[] = [
                    'label' => "Week {$p['week']} - {$p['year']}",
                    'count' => $mode === 'cumulative' ? $cumulative : $p['count'],
                ];
            }
        }

        return response()->json($result, 200);
    }

    /**
     * Get account type distribution for the dashboard.
     */
    public function getDashboardAccountTypes() {
        $records = User::select('account_type', DB::raw('count(*) as count'))
            ->groupBy('account_type')
            ->get();

        return response()->json($records, 200);
    }
}
