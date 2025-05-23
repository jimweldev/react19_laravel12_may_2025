<?php

namespace App\Http\Controllers;

use App\Helpers\QueryHelper;
use App\Models\RbacPermission;
use Illuminate\Http\Request;

class RbacPermissionController extends Controller {
    public function index(Request $request) {
        $queryParams = $request->all();

        try {
            $query = RbacPermission::query();

            // Apply query filters
            QueryHelper::apply($query, $queryParams);

            $records = $query->get();
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred.',
                'error' => $e->getMessage(),
            ], 400);
        }

        return response()->json($records, 200);
    }

    public function show($id) {
        $record = RbacPermission::where('id', $id)
            ->first();

        if (!$record) {
            return response()->json([
                'message' => 'Record not found.',
            ], 404);
        }

        return response()->json($record, 200);
    }

    public function store(Request $request) {
        try {
            // check if role already exists
            $roleExists = RbacPermission::where('value', $request->input('value'))->exists();

            if ($roleExists) {
                return response()->json([
                    'message' => 'Rbac Role already exists.',
                ], 400);
            }

            $record = RbacPermission::create($request->all());

            return response()->json($record);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred.',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    public function update(Request $request, $id) {
        try {
            $role = RbacPermission::find($id);

            if (!$role) {
                return response()->json([
                    'message' => 'Role not found.',
                ], 404);
            }

            $role->update($request->all());

            return response()->json($role);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred.',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    public function destroy($id) {
        try {
            $role = RbacPermission::find($id);

            if (!$role) {
                return response()->json([
                    'message' => 'Role not found.',
                ], 404);
            }

            $role->delete();

            return response()->json($role, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred.',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    public function paginate(Request $request) {
        $queryParams = $request->all();

        try {
            $query = RbacPermission::query();

            // Apply query filters
            $type = 'paginate';
            QueryHelper::apply($query, $queryParams, $type);

            // search
            if ($request->has('search')) {
                $search = $request->input('search');
                $query->where(function ($query) use ($search) {
                    $query->where('label', 'LIKE', '%'.$search.'%')
                        ->orWhere('value', 'LIKE', '%'.$search.'%');
                });
            }

            $total = $query->count();

            // limit and offset
            $limit = $request->input('limit', 10);
            $page = $request->input('page', 1);
            QueryHelper::applyLimitAndOffset($query, $limit, $page);

            $users = $query->get();

            return response()->json([
                'records' => $users,
                'info' => [
                    'total' => $total,
                    'pages' => ceil($total / $limit),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred.',
                'error' => $e->getMessage(),
            ], 400);
        }
    }
}
