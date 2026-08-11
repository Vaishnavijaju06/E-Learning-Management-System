package com.skillforge.backend.enums;

import java.time.LocalDateTime;

import com.skillforge.backend.enums.AssignmentStatus;

public record AssignmentResponse(
    Long id,
    Long courseId,
    String courseTitle,
    Long instructorId,
    String instructorName,
    String title,
    String description,
    String originalFileName,
    Integer maximumMarks,
    LocalDateTime dueDate,
    AssignmentStatus status,
    LocalDateTime createdAt
) {
}