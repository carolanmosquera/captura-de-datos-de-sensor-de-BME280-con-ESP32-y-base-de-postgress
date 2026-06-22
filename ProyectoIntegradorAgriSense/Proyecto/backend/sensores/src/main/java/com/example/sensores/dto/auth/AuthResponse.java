package com.example.sensores.dto.auth;

public record AuthResponse(
        String accessToken,
        String tokenType,
        UserAuthResponse user
) {
}