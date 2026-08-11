package com.skillforge.backend.dto;

import java.util.List;

public record CourseContentResponse(
    CourseResponse course,
    Integer progressPercent,
    List<ModuleContent> modules
) {
    public record ModuleContent(
        Long id,
        String title,
        Integer position,
        List<LessonResponse> lessons,
        Long quizId
    ) {
    }
}
