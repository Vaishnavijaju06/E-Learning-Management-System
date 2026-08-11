package com.skillforge.backend.dto;

public record ModuleResponse(
    Long id,
    Long courseId,
    String title,
    Integer position
) {
}
