package com.skillforge.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DiscussionRequest(

    @NotNull
    Long courseId,

    @NotBlank
    @Size(max = 200)
    String title,

    @NotBlank
    @Size(max = 2000)
    String message

) {
}