<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\RbacPermissionController;
use App\Http\Controllers\RbacRoleController;
use App\Http\Controllers\SelectController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [AuthController::class, 'loginWithEmail']);
Route::post('/auth/google-login', [AuthController::class, 'loginWithGoogle']);
Route::post('/auth/refresh-token', [AuthController::class, 'refreshToken']);

Route::middleware('check.token')->group(function () {
    // USERS
    Route::get('/users/paginate', [UserController::class, 'paginate']);
    Route::post('/users/import', [UserController::class, 'import']);

    // SETTINGS
    Route::patch('/users/{id}/change-password', [UserController::class, 'changePassword']);
    Route::patch('/users/{id}/profile', [UserController::class, 'updateProfile']);
    Route::post('/users/{id}/profile/avatar', [UserController::class, 'updateProfileAvatar']);

    // user roles
    Route::get('/users/{id}/user-roles', [UserController::class, 'getUserRoles']);
    Route::post('/users/{id}/user-roles', [UserController::class, 'addUserRoles']);
    Route::patch('/users/{id}/user-roles', [UserController::class, 'updateUserRoles']);
    Route::delete('/users/{id}/user-roles', [UserController::class, 'deleteUserRoles']);

    // archived users
    Route::get('/users/{id}/archived', [UserController::class, 'getArchivedUser']);
    Route::post('/users/{id}/archived/restore', [UserController::class, 'restoreArchivedUser']);
    Route::get('/users/archived/paginate', [UserController::class, 'getAllArchivedUsersPaginate']);

    Route::resource('/users', UserController::class);

    // RBAC
    // roles
    Route::get('/rbac/roles/paginate', [RbacRoleController::class, 'paginate']);
    Route::get('/rbac/roles/{id}/permissions/{permissionId}', [RbacRoleController::class, 'getPermission']);
    Route::post('/rbac/roles/{id}/permissions', [RbacRoleController::class, 'addPermission']);
    Route::delete('/rbac/roles/{id}/permissions/{permissionId}', [RbacRoleController::class, 'removePermission']);
    Route::resource('/rbac/roles', RbacRoleController::class);

    // permissions
    Route::get('/rbac/permissions/paginate', [RbacPermissionController::class, 'paginate']);
    Route::resource('/rbac/permissions', RbacPermissionController::class);

    // SELECT
    Route::get('/select/roles', [SelectController::class, 'getSelectRoles']);
    Route::get('/select/permissions', [SelectController::class, 'getSelectPermissions']);
    Route::get('/select/users', [SelectController::class, 'getSelectUsers']);
});
