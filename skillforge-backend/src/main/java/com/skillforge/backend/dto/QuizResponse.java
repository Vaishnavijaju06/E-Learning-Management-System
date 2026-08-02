package com.skillforge.backend.dto;

import java.util.List;

public record QuizResponse(
    Long id,
    Long moduleId,
    String title,
    Integer passingMarks,
    Integer maxAttempts,
    long attemptsUsed,
    boolean published,
    List<QuestionView> questions
) {
    public record QuestionView(
        Long id,
        String text,
        Integer marks,
        List<OptionView> options
    ) {
    }

    public record OptionView(
        Long id,
        String text,
        Boolean correct
    ) {
    }
}
