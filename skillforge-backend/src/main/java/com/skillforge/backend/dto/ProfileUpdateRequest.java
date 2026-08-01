package com.skillforge.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProfileUpdateRequest(
    @NotBlank @Size(max = 80) String firstName,
    @NotBlank @Size(max = 80) String lastName,
    @Size(max = 20) String phone,
    @Size(max = 500) String bio,
    @Size(max = 500) String profilePictureUrl
) {
}
