package com.skillforge.backend.dto;

public record AuthResponse(
    String token,
    UserResponse user
) {
}
