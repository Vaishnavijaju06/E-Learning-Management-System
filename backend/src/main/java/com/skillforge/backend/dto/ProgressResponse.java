package com.skillforge.backend.dto;

public record ProgressResponse(
    Long enrollmentId,
    Long lessonId,
    boolean completed,
    Integer progressPercent
) {
}
