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
    $accessTokenExpiry = 5;       // 15 minutes
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
    $token = isset($_COOKIE['access_token']) ? $_COOKIE['access_token'] : '';
    global $secretKey;
    $parts = explode('.', $token);
    if (count($parts) !== 3) return false;

    list($header64, $payload64, $signature64) = $parts;
    $header = json_decode(base64UrlDecode($header64), true);
    $payload = json_decode(base64UrlDecode($payload64), true);

    if (!$header || !$payload || $header['alg'] !== 'HS256') return false;

    $data = "$header64.$payload64";
    $expectedSig = base64UrlEncode(hash_hmac('sha256', $data, $secretKey, true));
    if (!hash_equals($expectedSig, $signature64)) return false;

    // Expired token — check refresh
    if (isset($payload['exp']) && time() >= $payload['exp']) {
        if (!isset($_COOKIE['refresh_token'])) return false;
        $newTokens = tryRefreshAccessToken($_COOKIE['refresh_token']);
        return $newTokens ?: false; // Return tokens if refresh worked
    }

    return ['valid' => true, 'payload' => $payload];
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

function tryRefreshAccessToken($refreshToken) {
    $payload = decodeAccessToken($refreshToken);
    if (!$payload || (isset($payload['type']) ? $payload['type'] : '') !== 'refresh') return false;

    $userId = $payload['user_id'];
    return generateAccessAndRefreshTokens($userId);
}

function authProcess() {
    $auth = validateAccessToken();

    if ($auth && isset($auth['valid'])) {
        $_SESSION['logged_in'] = true;
        $_SESSION['user_info'] = $auth['payload'];
        return true;

    } elseif ($auth && isset($auth['access_token'])) {
        // Refreshed tokens
        $_SESSION['logged_in'] = true;
        $_SESSION['user_info'] = decodeAccessToken($auth['access_token']);

        setcookie("access_token", $auth['access_token'], [
            'expires' => time() + 3600,
            'path' => '/',
            'secure' => true,
            'httponly' => true,
            'samesite' => 'Strict'
        ]);

        setcookie("refresh_token", $auth['refresh_token'], [
            'expires' => time() + 60 * 60 * 24 * 30,
            'path' => '/',
            'secure' => true,
            'httponly' => true,
            'samesite' => 'Strict'
        ]);
        return true;
    }
    $_SESSION['logged_in'] = false;
    return false;
}

