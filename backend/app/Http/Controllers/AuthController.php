<?php

namespace App\Http\Controllers;

use App\Helpers\UserHelper;
use App\Models\User;
use App\Models\UserLog;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller {
    /**
     * Handle login with email and password.
     */
    public function loginWithEmail(Request $request) {
        $userExists = User::where('email', $request->email)->first();

        if (!$userExists) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if (!Hash::check($request->password, $userExists->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = UserHelper::getUser($request->email);

        // Set token expiration times
        $accessTokenExpiresAt = Carbon::now()->addMinutes(config('jwt.ttl'));
        $refreshTokenExpiresAt = Carbon::now()->addMinutes(config('jwt.refresh_ttl'));

        // Generate access and refresh tokens
        $accessToken = JWTAuth::customClaims([
            'exp' => $accessTokenExpiresAt->timestamp,
            'token_type' => 'access',
        ])->fromUser($user);

        $refreshToken = JWTAuth::customClaims([
            'exp' => $refreshTokenExpiresAt->timestamp,
            'token_type' => 'refresh',
        ])->fromUser($user);

        UserLog::create([
            'user_id' => $user->id,
            'message' => 'Logged in with email',
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'user' => $user,
            'access_token' => $accessToken,
        ], 200)->cookie(
            'refresh_token',
            $refreshToken,
            config('jwt.refresh_ttl'),
            '/',
            null,
            config('app.env') === 'production',
            true,
            false,
        );
    }

    /**
     * Handle login with Google OAuth.
     */
    public function loginWithGoogle(Request $request) {
        /** @disregard Undefined method 'userFromToken' */
        $googleUser = Socialite::driver('google')->userFromToken($request->access_token);

        $user = UserHelper::getUser($googleUser->getEmail());

        if (!$user) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }

        try {
            // Set token expiration times
            $accessTokenExpiresAt = Carbon::now()->addMinutes(config('jwt.ttl'));
            $refreshTokenExpiresAt = Carbon::now()->addMinutes(config('jwt.refresh_ttl'));

            // Generate access and refresh tokens
            $accessToken = JWTAuth::customClaims([
                'exp' => $accessTokenExpiresAt->timestamp,
                'token_type' => 'access',
            ])->fromUser($user);

            $refreshToken = JWTAuth::customClaims([
                'exp' => $refreshTokenExpiresAt->timestamp,
                'token_type' => 'refresh',
            ])->fromUser($user);

            UserLog::create([
                'user_id' => $user->id,
                'message' => 'Logged in with Google',
                'ip_address' => $request->ip(),
            ]);

            return response()->json([
                'user' => $user,
                'access_token' => $accessToken,
            ], 200)->cookie(
                'refresh_token',
                $refreshToken,
                config('jwt.refresh_ttl'),
                '/',
                null,
                config('app.env') === 'production',
                true,
                false,
            );
        } catch (JWTException $e) {
            return response()->json(['message' => 'Authentication failed'], 500);
        }
    }

    /**
     * Refresh the JWT access token using a refresh token.
     */
    public function refreshToken(Request $request) {
        $refreshToken = trim($request->cookie('refresh_token'));

        if (empty($refreshToken)) {
            return response()->json(['message' => 'Invalid refresh token'], 401);
        }

        try {
            $payload = JWTAuth::setToken($refreshToken)->getPayload();

            if ($payload->get('token_type') !== 'refresh') {
                return response()->json(['message' => 'Invalid token type'], 401);
            }

            $user = User::find($payload->get('sub'));

            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            JWTAuth::invalidate($refreshToken);

            // Set token expiration times
            $accessTokenExpiresAt = Carbon::now()->addMinutes(config('jwt.ttl'));
            $refreshTokenExpiresAt = Carbon::now()->addMinutes(config('jwt.refresh_ttl'));

            // Generate new access and refresh tokens
            $accessToken = JWTAuth::customClaims([
                'exp' => $accessTokenExpiresAt->timestamp,
                'token_type' => 'access',
            ])->fromUser($user);

            $newRefreshToken = JWTAuth::customClaims([
                'exp' => $refreshTokenExpiresAt->timestamp,
                'token_type' => 'refresh',
            ])->fromUser($user);

            return response()->json([
                'access_token' => $accessToken,
            ], 200)->cookie(
                'refresh_token',
                $newRefreshToken,
                config('jwt.refresh_ttl'),
                '/',
                null,
                config('app.env') === 'production',
                true,
                false,
            );
        } catch (TokenExpiredException $e) {
            return response()->json(['message' => 'Refresh token expired'], 401);
        } catch (TokenInvalidException $e) {
            return response()->json(['message' => 'Invalid refresh token'], 401);
        } catch (JWTException $e) {
            return response()->json(['message' => 'Could not refresh token'], 500);
        }
    }
}
