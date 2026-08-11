package com.skillforge.backend.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillforge.backend.dto.CourseContentResponse;
import com.skillforge.backend.dto.ProgressResponse;
import com.skillforge.backend.service.ContentService;

@RestController
@RequestMapping("/api/learning")
public class LearningController {

    private final ContentService contentService;

    public LearningController(ContentService contentService) {
        this.contentService = contentService;
    }

    @GetMapping("/courses/{courseId}")
    @PreAuthorize(
        "hasAnyRole('STUDENT', 'INSTRUCTOR', 'ADMIN')"
    )
    public CourseContentResponse getContent(
        @PathVariable Long courseId
    ) {
        return contentService.getCourseContent(courseId);
    }

    @PutMapping("/lessons/{lessonId}/complete")
    @PreAuthorize("hasRole('STUDENT')")
    public ProgressResponse completeLesson(
        @PathVariable Long lessonId
    ) {
        return contentService.markLessonCompleted(lessonId);
    }
}
