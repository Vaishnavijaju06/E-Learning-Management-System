package com.skillforge.backend.dto;

import com.skillforge.backend.enums.Role;
import com.skillforge.backend.enums.UserStatus;

public record UserResponse(
    Long id,
    String firstName,
    String lastName,
    String email,
    String phone,
    String bio,
    String profilePictureUrl,
    Role role,
    UserStatus status
) {
}
