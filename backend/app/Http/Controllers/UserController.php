<?php

namespace App\Http\Controllers;

use App\Helpers\QueryHelper;
use App\Helpers\UserHelper;
use App\Models\User;
use App\Models\UserSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller {
    /**
     * Display a listing of users based on filters.
     */
    public function index(Request $request) {
        $queryParams = $request->all();

        try {
            $query = User::query();
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

    /**
     * Display the specified user by ID with roles.
     */
    public function show($id) {
        $record = User::where('id', $id)
            ->with(['rbac_user_roles' => function ($query) {
                $query->select('id', 'user_id', 'rbac_role_id')
                    ->with(['rbac_role' => function ($query) {
                        $query->select('id', 'label');
                    }]);
            }])
            ->first();

        if (!$record) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        return response()->json($record, 200);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request) {
        try {
            $userExists = User::where('email', $request->input('email'))->exists();

            if ($userExists) {
                return response()->json([
                    'message' => 'User already exists.',
                ], 400);
            }

            $request['password'] = Hash::make($request->input('P@ssword123!'));
            $record = User::create($request->all());

            return response()->json($record, 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred.',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Update the specified user by ID.
     */
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

    /**
     * Remove the specified user from storage.
     */
    public function destroy(Request $request, $id) {
        $authUser = $request->user();

        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    'message' => 'User not found.',
                ], 404);
            }

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

    /**
     * Paginate users with filtering, relations and search.
     */
    public function paginate(Request $request) {
        $queryParams = $request->all();

        try {
            $query = User::with(['rbac_user_roles' => function ($query) {
                $query->select('id', 'user_id', 'rbac_role_id')
                    ->with(['rbac_role' => function ($query) {
                        $query->select('id', 'label');
                    }]);
            }]);

            $type = 'paginate';
            QueryHelper::apply($query, $queryParams, $type);

            if (isset($queryParams['has'])) {
                foreach (explode(',', $queryParams['has']) as $h) {
                    $query->whereHas($h);
                }
            }

            if (isset($queryParams['with'])) {
                if (in_array('rbac_user_roles', explode(',', $queryParams['with']))) {
                    $query->with(['rbac_user_roles' => function ($query) {
                        $query->select('id', 'user_id', 'rbac_role_id')
                            ->with(['rbac_role' => function ($query) {
                                $query->select('id', 'label');
                            }]);
                    }]);
                }
            }

            if ($request->has('search')) {
                $search = $request->input('search');
                $query->where(function ($query) use ($search) {
                    $query->where('email', 'LIKE', "%$search%")
                        ->orWhere('first_name', 'LIKE', "%$search%")
                        ->orWhere('middle_name', 'LIKE', "%$search%")
                        ->orWhere('last_name', 'LIKE', "%$search%")
                        ->orWhere('suffix', 'LIKE', "%$search%")
                        ->orWhereHas('rbac_user_roles.rbac_role', function ($query) use ($search) {
                            $query->where('label', 'LIKE', "%$search%");
                        });
                });
            }

            $total = $query->count();
            $limit = $request->input('limit', 10);
            $page = $request->input('page', 1);
            QueryHelper::applyLimitAndOffset($query, $limit, $page);
            $records = $query->get();

            return response()->json([
                'records' => $records,
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

    /**
     * Import a list of users from a dataset.
     */
    public function import(Request $request) {
        try {
            $info = ['new' => 0, 'skipped' => 0];
            $data = $request->input('data');

            foreach ($data as $user) {
                $email = $user['Email'] ?? null;

                if (!$email) {
                    return response()->json(['message' => 'Email is required'], 400);
                }

                if (!User::where('email', $email)->exists()) {
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

    /**
     * Retrieve an archived (soft-deleted) user.
     */
    public function getArchivedUser($id) {
        $record = User::onlyTrashed()->find($id);

        return response()->json($record, 200);
    }

    /**
     * Restore a soft-deleted user.
     */
    public function restoreArchivedUser($id) {
        try {
            $record = User::onlyTrashed()->find($id);

            if (!$record) {
                return response()->json(['message' => 'User not found.'], 404);
            }

            $record->restore();

            return response()->json($record, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred.',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Paginate through archived users.
     */
    public function getAllArchivedUsersPaginate(Request $request) {
        $queryParams = $request->all();

        try {
            $query = User::onlyTrashed();

            QueryHelper::apply($query, $queryParams, 'paginate');

            if ($request->has('search')) {
                $search = $request->input('search');
                $query->where(function ($query) use ($search) {
                    $query->where('email', 'LIKE', "%$search%")
                        ->orWhere('first_name', 'LIKE', "%$search%")
                        ->orWhere('middle_name', 'LIKE', "%$search%")
                        ->orWhere('last_name', 'LIKE', "%$search%")
                        ->orWhere('suffix', 'LIKE', "%$search%");
                });
            }

            $total = $query->count();
            $limit = $request->input('limit', 10);
            $page = $request->input('page', 1);
            QueryHelper::applyLimitAndOffset($query, $limit, $page);

            return response()->json([
                'records' => $query->get(),
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

    /**
     * Get user roles by user ID.
     */
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
            return response()->json(['message' => 'Record not found.'], 404);
        }

        return response()->json($record, 200);
    }

    /**
     * Update roles for a user.
     */
    public function updateUserRoles(Request $request, $id) {
        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json(['message' => 'User not found.'], 404);
            }

            $user->rbac_roles()->sync($request->input('role_ids', []));

            return response()->json([
                'message' => 'User roles updated successfully.',
                'roles' => $user->rbac_roles,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating user roles',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Change the user's password.
     */
    public function changePassword(Request $request) {
        $authUser = $request->user();

        try {
            $currentPassword = $request->input('current_password');
            $newPassword = $request->input('new_password');
            $confirmNewPassword = $request->input('confirm_new_password');

            if (!$currentPassword || !$newPassword || !$confirmNewPassword) {
                return response()->json(['message' => 'All fields are required.'], 400);
            }

            if ($newPassword !== $confirmNewPassword) {
                return response()->json(['message' => 'New passwords do not match.'], 400);
            }

            $user = User::find($authUser->id);

            if (!$user) {
                return response()->json(['message' => 'User not found.'], 404);
            }

            if (!Hash::check($currentPassword, $user->password)) {
                return response()->json(['message' => 'Current password is incorrect.'], 400);
            }

            $user->password = Hash::make($newPassword);
            $user->save();

            return response()->json(['message' => 'Password changed successfully.'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred.', 'error' => $e->getMessage()], 400);
        }
    }

    /**
     * Update a user's profile.
     */
    public function updateProfile(Request $request) {
        $authUser = $request->user();

        try {
            $user = User::find($authUser->id);
            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            $user->update($request->all());
            $user = UserHelper::getUser($user->email);

            return response()->json($user);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred.', 'error' => $e->getMessage()], 400);
        }
    }

    /**
     * Update user's avatar.
     */
    public function updateProfileAvatar(Request $request) {
        $authUser = $request->user();

        try {
            $user = User::find($authUser->id);
            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            $avatarData = $request->input('avatar');
            if (!$avatarData) {
                return response()->json(['message' => 'No avatar data provided'], 400);
            }

            $data = explode(';base64,', $avatarData);
            if (count($data) !== 2) {
                return response()->json(['message' => 'Invalid avatar format'], 400);
            }

            $imageExt = explode('/', mime_content_type($avatarData))[1];
            $avatarContent = base64_decode($data[1]);

            if (!$avatarContent) {
                return response()->json(['message' => 'Failed to decode avatar'], 400);
            }

            $avatarName = uniqid().'.'.$imageExt;
            Storage::disk('public')->put('avatars/'.$avatarName, $avatarContent);

            if ($user->avatar) {
                Storage::disk('public')->delete('avatars/'.$user->avatar);
            }

            $user->avatar = $avatarName;
            $user->save();

            return response()->json([
                'avatar' => $avatarName,
                'message' => 'Avatar updated successfully!',
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred.', 'error' => $e->getMessage()], 400);
        }
    }

    /**
     * Update authenticated user's settings.
     */
    public function updateUserSettings(Request $request) {
        $authUser = $request->user();

        try {
            $userSetting = UserSetting::firstOrCreate(
                ['user_id' => $authUser->id],
                $request->all()
            );

            $userSetting->update($request->all());
            $user = UserHelper::getUser($authUser->email);

            return response()->json($user);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred.', 'error' => $e->getMessage()], 400);
        }
    }
}
