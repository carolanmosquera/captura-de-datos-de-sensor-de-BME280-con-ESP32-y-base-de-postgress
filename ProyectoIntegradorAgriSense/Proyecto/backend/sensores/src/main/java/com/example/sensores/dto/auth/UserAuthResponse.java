package com.example.sensores.dto.auth;

public record UserAuthResponse(
        Long id,
        String name,
        String email,
        String phone,
        String status
) {
}