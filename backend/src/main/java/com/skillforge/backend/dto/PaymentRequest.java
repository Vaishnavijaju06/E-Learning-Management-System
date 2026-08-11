package com.skillforge.backend.dto;

import jakarta.validation.constraints.NotNull;

public record PaymentRequest(
    @NotNull Long courseId
) {
}
