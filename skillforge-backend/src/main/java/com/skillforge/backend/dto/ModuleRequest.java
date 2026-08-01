package com.skillforge.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ModuleRequest(
    @NotBlank @Size(max = 180) String title,
    @NotNull @Min(1) Integer position
) {
}
