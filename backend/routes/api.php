<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CatController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MailLogController;
use App\Http\Controllers\MailTemplateController;
use App\Http\Controllers\RbacPermissionController;
use App\Http\Controllers\RbacRoleController;
use App\Http\Controllers\SelectController;
use App\Http\Controllers\SystemGlobalDropdownController;
use App\Http\Controllers\SystemSettingController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [AuthController::class, 'loginWithEmail']);
Route::post('/auth/google-login', [AuthController::class, 'loginWithGoogle']);
Route::post('/auth/refresh-token', [AuthController::class, 'refreshToken']);

Route::middleware('check.token')->group(function () {
    // ===================================================================
    // ===================================================================
    // === ADMIN
    // ===================================================================
    // ===================================================================

    // ==============
    // === DASHBOARD
    Route::get('/dashboard/statistics', [DashboardController::class, 'getDashboardStatistics']);
    Route::get('/dashboard/user-registration-stats', [DashboardController::class, 'getUserRegistrationStats']);
    Route::get('/dashboard/account-types', [DashboardController::class, 'getDashboardAccountTypes']);

    // ==============
    // === USERS
    // users
    Route::get('/users/paginate', [UserController::class, 'paginate']);
    Route::post('/users/import', [UserController::class, 'import']);
    Route::resource('/users', UserController::class);

    // user roles
    Route::get('/users/{id}/user-roles', [UserController::class, 'getUserRoles']);
    Route::patch('/users/{id}/user-roles', [UserController::class, 'updateUserRoles']);

    // archived users
    Route::get('/users/{id}/archived', [UserController::class, 'getArchivedUser']);
    Route::post('/users/{id}/archived/restore', [UserController::class, 'restoreArchivedUser']);
    Route::get('/users/archived/paginate', [UserController::class, 'getAllArchivedUsersPaginate']);

    // roles
    Route::get('/rbac/roles/paginate', [RbacRoleController::class, 'paginate']);
    Route::get('/rbac/roles/{id}/permissions/{permissionId}', [RbacRoleController::class, 'getPermission']);
    Route::post('/rbac/roles/{id}/permissions', [RbacRoleController::class, 'addPermission']);
    Route::delete('/rbac/roles/{id}/permissions/{permissionId}', [RbacRoleController::class, 'removePermission']);
    Route::resource('/rbac/roles', RbacRoleController::class);

    // permissions
    Route::get('/rbac/permissions/paginate', [RbacPermissionController::class, 'paginate']);
    Route::resource('/rbac/permissions', RbacPermissionController::class);

    // ==============
    // === SYSTEM
    // settings
    Route::get('/system/settings/paginate', [SystemSettingController::class, 'paginate']);
    Route::resource('/system/settings', SystemSettingController::class);

    // global dropdowns
    Route::get('/system/global-dropdowns/paginate', [SystemGlobalDropdownController::class, 'paginate']);
    Route::resource('/system/global-dropdowns', SystemGlobalDropdownController::class);

    // ==============
    // === MAILS
    // logs
    Route::get('/mails/logs/paginate', [MailLogController::class, 'paginate']);
    Route::resource('/mails/logs', MailLogController::class);

    // templates
    Route::get('/mails/templates/paginate', [MailTemplateController::class, 'paginate']);
    Route::resource('/mails/templates', MailTemplateController::class);

    // ===================================================================
    // ===================================================================
    // === USER SETTINGS
    // ===================================================================
    // ===================================================================

    // ==============
    // === SETTINGS
    Route::patch('/settings/change-password', [UserController::class, 'changePassword']);
    Route::patch('/settings/profile', [UserController::class, 'updateProfile']);
    Route::post('/settings/profile/avatar', [UserController::class, 'updateProfileAvatar']);
    Route::patch('/settings', [UserController::class, 'updateUserSettings']);

    // ===================================================================
    // ===================================================================
    // === SELECTS
    // ===================================================================
    // ===================================================================

    // ==============
    // === SELECT
    Route::get('/select/roles', [SelectController::class, 'getSelectRoles']);
    Route::get('/select/permissions', [SelectController::class, 'getSelectPermissions']);
    Route::get('/select/users', [SelectController::class, 'getSelectUsers']);
    Route::get('/select/global-dropdowns', [SelectController::class, 'getSelectSystemGlobalDropdowns']);

    // ===================================================================
    // ===================================================================
    // === EXAMPLES
    // ===================================================================
    // ===================================================================

    // ==============
    // === CATS
    Route::get('/cats/paginate', [CatController::class, 'paginate']);
    Route::resource('/cats', CatController::class);
});
