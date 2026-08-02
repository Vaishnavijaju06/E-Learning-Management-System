package com.skillforge.backend.dto;

public record QuizResultResponse(
    Long attemptId,
    Integer score,
    Integer totalMarks,
    Integer passingMarks,
    boolean passed,
    Integer attemptNumber,
    Integer attemptsRemaining
) {
}
