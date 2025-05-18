<?php

namespace App\Http\Controllers;

use App\Helpers\QueryHelper;
use App\Models\RbacRole;
use App\Models\RbacRolePermission;
use Illuminate\Http\Request;

class RbacRoleController extends Controller {
    public function index(Request $request) {
        $queryParams = $request->all();

        try {
            $query = RbacRole::query();

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
        $record = RbacRole::where('id', $id);

        $record->with(['rbac_role_permissions' => function ($query) {
            $query->select('id', 'rbac_role_id', 'rbac_permission_id')
                ->with(['rbac_permission' => function ($query) {
                    $query->select('id', 'label');
                }]);
            }
        ]);

        $record = $record->first();

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
            $roleExists = RbacRole::where('value', $request->input('value'))->exists();

            if ($roleExists) {
                return response()->json([
                    'message' => 'Rbac Role already exists.',
                ], 400);
            }

            $record = RbacRole::create($request->all());

            $record->rbac_permissions()->sync($request->input('permission_ids'));

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
            $role = RbacRole::find($id);

            if (!$role) {
                return response()->json([
                    'message' => 'Role not found.',
                ], 404);
            }

            // Update role fields
            $role->update($request->all());

            // Sync permissions (use `rbac_permissions` instead of `rbac_role_permissions`)
            if ($request->has('permission_ids')) {
                $role->rbac_permissions()->sync($request->input('permission_ids'));
            }

            return response()->json([
                'message' => 'Role updated successfully',
                'role' => $role->load('rbac_permissions'),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred.',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    public function destroy($id) {
        try {
            $role = RbacRole::find($id);

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
            $query = RbacRole::query();

            $query = RbacRole::with(['rbac_role_permissions' => function ($query) {
                $query->select('id', 'rbac_role_id', 'rbac_permission_id')
                    ->with(['rbac_permission' => function ($query) {
                        $query->select('id', 'label');
                    }]);
            }]);

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

    // PERMISSIONS
    public function getPermission($id, $permissionId) {
        $record = RbacRolePermission::where('rbac_role_id', $id)
            ->with(['rbac_permission' => function ($query) {
                $query->select('id', 'label');
            }])
            ->where('rbac_permission_id', $permissionId)
            ->first();

        if (!$record) {
            return response()->json([
                'message' => 'Record not found.',
            ], 404);
        }

        return response()->json($record, 200);
    }

    public function addPermission(Request $request, $id) {
        try {
            $rolePermissionExists = RbacRolePermission::where('rbac_role_id', $id)
                ->where('rbac_permission_id', $request->input('rbac_permission_id'))
                ->exists();

            if ($rolePermissionExists) {
                return response()->json([
                    'message' => 'Role Permission already exists.',
                ], 400);
            }

            $rolePermission = RbacRolePermission::create([
                'rbac_role_id' => $id,
                'rbac_permission_id' => $request->input('rbac_permission_id'),
            ]);

            return response()->json($rolePermission, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred.',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    public function removePermission($id, $permissionId) {
        try {
            $rolePermission = RbacRolePermission::where('rbac_role_id', $id)
                ->where('rbac_permission_id', $permissionId)
                ->first();
            if (!$rolePermission) {
                return response()->json([
                    'message' => 'Role Permission not found.',
                ], 404);
            }
            $rolePermission->delete();

            return response()->json($rolePermission, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred.',
                'error' => $e->getMessage(),
            ], 400);
        }
    }
}
