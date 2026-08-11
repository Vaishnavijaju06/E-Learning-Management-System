package com.skillforge.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record LessonRequest(
    @NotBlank @Size(max = 180) String title,
    @Size(max = 10000) String content,
    @Size(max = 700) String videoUrl,
    @NotNull @Min(1) Integer position
) {
}
