package com.skillforge.backend.dto;

import java.math.BigDecimal;

import com.skillforge.backend.enums.CourseLevel;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CourseRequest(
    @NotBlank @Size(max = 180) String title,
    @NotBlank @Size(max = 5000) String description,
    @NotNull @DecimalMin("0.0") BigDecimal price,
    @NotNull CourseLevel level,
    @NotNull Long categoryId,
    @Size(max = 500) String thumbnailUrl
) {
}
