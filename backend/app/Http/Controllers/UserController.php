<?php

namespace App\Http\Controllers;

use App\Helpers\QueryHelper;
use App\Models\RbacUserRole;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller {
    public function index(Request $request) {
        $queryParams = $request->all();

        try {
            $query = User::query();

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
        $record = User::find($id);

        if (!$record) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        return response()->json($record);
    }

    public function store(Request $request) {
        try {
            // check if email already exists
            $userExists = User::where('email', $request->input('email'))->exists();

            if ($userExists) {
                return response()->json([
                    'message' => 'User already exists.',
                ], 400);
            }

            // add default password
            $request['password'] = Hash::make($request->input('P@ssword123!'));

            $record = User::create($request->all());

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
            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    'message' => 'User not found.',
                ], 404);
            }

            $user->update($request->all());

            return response()->json($user);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred.',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    public function destroy(Request $request, $id) {
        $authUser = $request->user();

        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    'message' => 'User not found.',
                ], 404);
            }

            // do not delete if the user is me
            if ($user->id == $authUser->id) {
                return response()->json([
                    'message' => 'You cannot delete your own account.',
                ], 400);
            }

            $user->delete();

            return response()->json($user);
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
            $query = User::query();

            // Apply query filters
            $type = 'paginate';
            QueryHelper::apply($query, $queryParams, $type);

            // check if params has `has`
            if (isset($queryParams['has'])) {
                $has = explode(',', $queryParams['has']);

                foreach ($has as $h) {
                    $query->whereHas($h);
                }
            }

            // check if params has `with`
            if (isset($queryParams['with'])) {
                $with = explode(',', $queryParams['with']);

                // check if `with` has `permissions`
                if (in_array('rbac_user_roles', $with)) {
                    $query->with(['rbac_user_roles' => function ($query) {
                        $query->select('id', 'user_id', 'rbac_role_id')
                            ->with(['rbac_role' => function ($query) {
                                $query->select('id', 'label');
                            }]);
                    }]);
                }
            }

            // search
            if ($request->has('search')) {
                $search = $request->input('search');
                $query->where(function ($query) use ($search) {
                    $query->where('email', 'LIKE', '%'.$search.'%')
                        ->orWhere('first_name', 'LIKE', '%'.$search.'%')
                        ->orWhere('middle_name', 'LIKE', '%'.$search.'%')
                        ->orWhere('last_name', 'LIKE', '%'.$search.'%')
                        ->orWhere('suffix', 'LIKE', '%'.$search.'%');
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
                'message' => 'An error occurred. Kindly check all the parameters provided. '.$e->getMessage(),
            ], 400);
        }
    }

    public function import(Request $request) {
        try {
            $info = [
                'new' => 0,
                'skipped' => 0,
            ];

            $data = $request->input('data');

            foreach ($data as $user) {
                $email = $user['Email'] ?? null;

                // Validate and normalize data
                if (!$email) {
                    return response()->json(['message' => 'Email is required'], 400);
                }

                $userExists = User::where('email', $email)->exists();

                if (!$userExists) {
                    $info['new']++;

                    User::create([
                        'email' => strtolower($email),
                        'first_name' => $user['First Name'] ?? null,
                        'middle_name' => $user['Middle Name'] ?? null,
                        'last_name' => $user['Last Name'] ?? null,
                        'suffix' => $user['Suffix'] ?? null,
                        'password' => Hash::make('P@ssword123!'),
                    ]);
                } else {
                    $info['skipped']++;
                }
            }

            return response()->json([
                'message' => 'Users imported successfully',
                'info' => $info,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred.',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    public function getArchivedUser($id) {
        $record = User::onlyTrashed()->find($id);

        return response()->json($record);
    }

    public function restoreArchivedUser($id) {
        try {
            $record = User::onlyTrashed()->find($id);

            if (!$record) {
                return response()->json([
                    'message' => 'User not found.',
                ], 404);
            }

            $record->restore();

            return response()->json($record);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred.',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    public function getAllArchivedUsersPaginate(Request $request) {
        $queryParams = $request->all();

        try {
            $query = User::onlyTrashed();

            // Apply query filters
            $type = 'paginate';
            QueryHelper::apply($query, $queryParams, $type);

            // search
            if ($request->has('search')) {
                $search = $request->input('search');
                $query->where(function ($query) use ($search) {
                    $query->where('email', 'LIKE', '%'.$search.'%')
                        ->orWhere('first_name', 'LIKE', '%'.$search.'%')
                        ->orWhere('middle_name', 'LIKE', '%'.$search.'%')
                        ->orWhere('last_name', 'LIKE', '%'.$search.'%')
                        ->orWhere('suffix', 'LIKE', '%'.$search.'%');
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
                'message' => 'An error occurred. Kindly check all the parameters provided. '.$e->getMessage(),
            ], 400);
        }
    }

    // USER ROLES
    public function getUserRoles($id) {
        $record = User::where('id', $id)
            ->with(['rbac_user_roles' => function ($query) {
                $query->select('id', 'user_id', 'rbac_role_id')
                    ->with(['rbac_role' => function ($query) {
                        $query->select('id', 'label', 'value');
                    }]);
            }])
            ->first();

        if (!$record) {
            return response()->json([
                'message' => 'Record not found.',
            ], 404);
        }

        return response()->json($record, 200);
    }

    public function addUserRoles(Request $request, $id) {
        try {
            // check if role already exists
            $roleExists = RbacUserRole::where('user_id', $id)->exists();
            if ($roleExists) {
                return response()->json([
                    'message' => 'User already exists',
                ], 400);
            }

            $records = [];

            // create role
            $roleIds = $request->input('role_ids');
            foreach ($roleIds as $roleId) {
                $role = RbacUserRole::create([
                    'user_id' => $id,
                    'rbac_role_id' => $roleId,
                ]);

                // append to records
                array_push($records, $role);
            }

            return response()->json([
                'data' => $records,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error creating role'], 500);
        }
    }

    public function updateUserRoles(Request $request, $id) {
        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    'message' => 'User not found.',
                ], 404);
            }

            // Sync user roles
            $user->rbac_roles()->sync($request->input('role_ids', []));

            return response()->json([
                'message' => 'User roles updated successfully.',
                'roles' => $user->rbac_roles, // Load updated roles
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating user roles',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function deleteUserRoles($id) {
        try {
            $records = RbacUserRole::where('user_id', $id)->delete();

            return response()->json([
                'records' => $records,
                'message' => 'User roles deleted successfully.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred.',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    // SETTINGS
    public function changePassword(Request $request, $id) {
        try {
            $currentPassword = $request->input('current_password');
            $newPassword = $request->input('new_password');
            $confirmNewPassword = $request->input('confirm_new_password');

            if (!$currentPassword || !$newPassword || !$confirmNewPassword) {
                return response()->json([
                    'message' => 'All fields are required.',
                ], 400);
            }

            if ($newPassword !== $confirmNewPassword) {
                return response()->json([
                    'message' => 'New passwords do not match.',
                ], 400);
            }

            // check if the current password is correct
            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    'message' => 'User not found.',
                ], 404);
            }

            if (!Hash::check($currentPassword, $user->password)) {
                return response()->json([
                    'message' => 'Current password is incorrect.',
                ], 400); // Add the 400 status code here
            }

            $user->password = Hash::make($newPassword);
            $user->save();
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred.',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    public function updateProfile(Request $request, $id) {
        try {
            $user = User::find($id);
            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }
            $user->update($request->all());

            return response()->json($user);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred.',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    public function updateProfileAvatar(Request $request, $id) {
        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            // Ensure the avatar is present
            $avatarData = $request->input('avatar');
            if (!$avatarData) {
                return response()->json(['message' => 'No avatar data provided'], 400);
            }

            // Extract the Base64 content
            $data = explode(';base64,', $avatarData);
            if (count($data) !== 2) {
                return response()->json(['message' => 'Invalid avatar format'], 400);
            }

            $imageExt = explode('/', mime_content_type($avatarData))[1];
            $avatarContent = base64_decode($data[1]);

            if (!$avatarContent) {
                return response()->json(['message' => 'Failed to decode avatar'], 400);
            }

            // Generate a unique file name and store it
            $avatarName = uniqid().'.'.$imageExt;
            Storage::disk('public')->put('avatars/'.$avatarName, $avatarContent);

            // Delete old avatar if exists
            if ($user->avatar) {
                Storage::disk('public')->delete('avatars/'.$user->avatar);
            }

            // Update user avatar path
            $user->avatar = $avatarName;
            $user->save();

            return response()->json([
                'avatar' => $avatarName,
                'message' => 'Avatar updated successfully!',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred.',
                'error' => $e->getMessage(),
            ], 400);
        }
    }
}
