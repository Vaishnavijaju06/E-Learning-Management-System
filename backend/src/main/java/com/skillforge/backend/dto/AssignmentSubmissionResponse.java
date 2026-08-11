package com.skillforge.backend.dto;

import java.time.LocalDateTime;

import com.skillforge.backend.enums.SubmissionStatus;

public record AssignmentSubmissionResponse(
    Long id,
    Long assignmentId,
    String assignmentTitle,
    Long studentId,
    String studentName,
    String studentEmail,
    String originalFileName,
    String comment,
    LocalDateTime submittedAt,
    SubmissionStatus status,
    Integer marksObtained,
    Integer maximumMarks,
    String feedback,
    LocalDateTime evaluatedAt
) {
}