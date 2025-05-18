<?php

namespace App\Http\Controllers;

use App\Helpers\UserHelper;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller {
    public function loginWithEmail(Request $request) {
        $userExists = User::where('email', $request->email)->first();

        if (!$userExists) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if (!Hash::check($request->password, $userExists->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = UserHelper::getUser($request->email);

        // Get expiration values from config
        $accessTokenExpiresAt = Carbon::now()->addMinutes(config('jwt.ttl'));
        $refreshTokenExpiresAt = Carbon::now()->addMinutes(config('jwt.refresh_ttl'));

        // Generate access token
        $accessToken = JWTAuth::customClaims([
            'exp' => $accessTokenExpiresAt->timestamp,
            'token_type' => 'access',
        ])->fromUser($user);

        // Generate refresh token (longer-lived)
        $refreshToken = JWTAuth::customClaims([
            'exp' => $refreshTokenExpiresAt->timestamp,
            'token_type' => 'refresh',
        ])->fromUser($user);

        return response()->json([
            'user' => $user,
            'access_token' => $accessToken,
        ])->cookie(
            'refresh_token',
            $refreshToken,
            config('jwt.refresh_ttl'),
            '/',
            null,
            config('app.env') === 'production', // secure in production
            true, // httpOnly
            false,
        );
    }

    public function loginWithGoogle(Request $request) {
        /** @disregard Undefined method 'userFromToken' */
        $googleUser = Socialite::driver('google')->userFromToken($request->access_token);

        // Check if the user already exists
        $user = UserHelper::getUser($googleUser->getEmail());

        if (!$user) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }

        try {
            // Get expiration values from config
            $accessTokenExpiresAt = Carbon::now()->addMinutes(config('jwt.ttl'));
            $refreshTokenExpiresAt = Carbon::now()->addMinutes(config('jwt.refresh_ttl'));

            // Generate access token
            $accessToken = JWTAuth::customClaims([
                'exp' => $accessTokenExpiresAt->timestamp,
                'token_type' => 'access',
            ])->fromUser($user);

            // Generate refresh token (longer-lived)
            $refreshToken = JWTAuth::customClaims([
                'exp' => $refreshTokenExpiresAt->timestamp,
                'token_type' => 'refresh',
            ])->fromUser($user);

            return response()->json([
                'user' => $user,
                'access_token' => $accessToken,
            ])->cookie(
                'refresh_token',
                $refreshToken,
                config('jwt.refresh_ttl'),
                '/',
                null,
                config('app.env') === 'production', // secure in production
                true, // httpOnly
                false,
            );
        } catch (JWTException $e) {
            return response()->json(['message' => 'Authentication failed'], 500);
        }
    }

    public function refreshToken(Request $request) {
        // Get refresh token from cookie
        $refreshToken = trim($request->cookie('refresh_token'));

        if (!$refreshToken) {
            return response()->json(['message' => 'Invalid refresh token'], 401);
        }

        try {
            // Verify the refresh token first
            $payload = JWTAuth::setToken($refreshToken)->getPayload();

            // Validate token type
            if ($payload->get('token_type') !== 'refresh') {
                return response()->json(['message' => 'Invalid token type'], 401);
            }

            // Get the user
            $user = User::find($payload->get('sub'));

            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            // Invalidate the old refresh token (optional but recommended)
            JWTAuth::invalidate($refreshToken);

            // Generate new tokens
            $accessTokenExpiresAt = Carbon::now()->addMinutes(config('jwt.ttl'));
            $refreshTokenExpiresAt = Carbon::now()->addMinutes(config('jwt.refresh_ttl'));

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
            ])->cookie(
                'refresh_token',
                $newRefreshToken,
                config('jwt.refresh_ttl'),
                '/',
                null,
                config('app.env') === 'production', // secure in production
                true, // httpOnly
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
