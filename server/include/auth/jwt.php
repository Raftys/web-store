<?php

$secretKey = "b6J8cZxN3pT9Yu0LAzK5QfW1RXgV2JeOM8Fs9kYHlZA";

function base64UrlEncode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64UrlDecode($input) {
    $remainder = strlen($input) % 4;
    if ($remainder) {
        $padLen = 4 - $remainder;
        $input .= str_repeat('=', $padLen);
    }
    return base64_decode(strtr($input, '-_', '+/'));
}

function generateJWT($payload, $expirySeconds) {
    global $secretKey;
    $header = ['typ' => 'JWT', 'alg' => 'HS256'];
    $payload['iat'] = time();
    $payload['exp'] = time() + $expirySeconds;

    $headerEncoded = base64UrlEncode(json_encode($header));
    $payloadEncoded = base64UrlEncode(json_encode($payload));

    $signature = hash_hmac('sha256', "$headerEncoded.$payloadEncoded", $secretKey, true);
    $signatureEncoded = base64UrlEncode($signature);

    return "$headerEncoded.$payloadEncoded.$signatureEncoded";
}

function generateAccessAndRefreshTokens($userId) {
    global $secretKey;
    $accessTokenExpiry = 15 * 60;       // 15 minutes
    $refreshTokenExpiry = 7 * 24 * 3600; // 7 days

    $accessTokenPayload = [
        'user_id' => $userId,
    ];

    $refreshTokenPayload = [
        'user_id' => $userId,
        'type' => 'refresh',
    ];

    $accessToken = generateJWT($accessTokenPayload, $accessTokenExpiry);
    $refreshToken = generateJWT($refreshTokenPayload, $refreshTokenExpiry);

    return [
        'access_token' => $accessToken,
        'refresh_token' => $refreshToken,
    ];
}

function validateAccessToken() {
    $token = isset($_COOKIE['access_token']) ? $_COOKIE['access_token'] : " ";
    global $secretKey;
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return false; // Invalid token format
    }

    list($header64, $payload64, $signature64) = $parts;

    // Decode header and payload
    $header = json_decode(base64UrlDecode($header64), true);
    $payload = json_decode(base64UrlDecode($payload64), true);
    if (!$header || !$payload) {
        return false; // Invalid JSON
    }

    // Verify the algorithm is what you expect (e.g. HS256)
    if (empty($header['alg']) || $header['alg'] !== 'HS256') {
        return false;
    }

    // Verify signature
    $data = $header64 . '.' . $payload64;
    $expectedSig = hash_hmac('sha256', $data, $secretKey, true);
    $expectedSig64 = rtrim(strtr(base64_encode($expectedSig), '+/', '-_'), '=');

    if (!hash_equals($expectedSig64, $signature64)) {
        return false; // Signature invalid
    }

    // Check expiration time if set
    if (isset($payload['exp']) && time() >= $payload['exp']) {
        // Token expired — try to refresh if refresh token exists
        if (isset($_COOKIE['refresh_token'])) {
            $newTokens = refreshAccessToken($_COOKIE['refresh_token']);
            if ($newTokens) {
                // Tokens refreshed successfully
                return true;
            }
        }
        return false; // Expired and refresh failed or no refresh token
    }

    // All checks passed
    return true;
}

function decodeAccessToken($token) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return null;
    }
    $payload64 = $parts[1];
    $payload = json_decode(base64UrlDecode($payload64), true);
    return $payload ?: null;
}

function setTokens($customer_id) {

    $tokens = generateAccessAndRefreshTokens($customer_id);

    // Access Token (expires in 1 hour)
    setcookie("access_token", $tokens["access_token"], [
        'expires' => time() + 3600,
        'path' => '/',
        'secure' => true,      // HTTPS only
        'httponly' => true,    // JS cannot access
        'samesite' => 'Strict' // or 'Lax', protects against CSRF
    ]);

    // Refresh Token (expires in 30 days)
    setcookie("refresh_token", $tokens["refresh_token"], [
        'expires' => time() + 60*60*24*30,
        'path' => '/',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'Strict'
    ]);
}


function refreshAccessToken($refreshToken) {

    // Decode the refresh token to get its payload
    $payload = decodeAccessToken($refreshToken);
    if (!$payload) {
        return null;
    }

    // Check that this is actually a refresh token
    if (!isset($payload['type']) || $payload['type'] !== 'refresh') {
        return null;
    }

    // Get the user ID from the payload
    $userId = $payload['user_id'];

    // Create new tokens
    $newTokens = generateAccessAndRefreshTokens($userId);

    // Set the new cookies
    setcookie("access_token", $newTokens["access_token"], [
        'expires' => time() + 3600,
        'path' => '/',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'Strict'
    ]);

    setcookie("refresh_token", $newTokens["refresh_token"], [
        'expires' => time() + 60*60*24*30,
        'path' => '/',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'Strict'
    ]);
}
