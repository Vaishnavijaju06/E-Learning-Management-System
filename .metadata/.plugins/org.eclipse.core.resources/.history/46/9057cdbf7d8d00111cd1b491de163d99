package com.skillforge.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillforge.backend.dto.CourseRequest;
import com.skillforge.backend.dto.CourseResponse;
import com.skillforge.backend.dto.LessonRequest;
import com.skillforge.backend.dto.LessonResponse;
import com.skillforge.backend.dto.ModuleRequest;
import com.skillforge.backend.dto.ModuleResponse;
import com.skillforge.backend.service.ContentService;
import com.skillforge.backend.service.CourseService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/instructor")
@PreAuthorize("hasRole('INSTRUCTOR')")
public class InstructorCourseController {

    private final CourseService courseService;
    private final ContentService contentService;

    public InstructorCourseController(
        CourseService courseService,
        ContentService contentService
    ) {
        this.courseService = courseService;
        this.contentService = contentService;
    }

    @GetMapping("/courses")
    public List<CourseResponse> findCourses() {
        return courseService.findInstructorCourses();
    }

    @PostMapping("/courses")
    public ResponseEntity<CourseResponse> createCourse(
        @Valid @RequestBody CourseRequest request
    ) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(courseService.create(request));
    }

    @PutMapping("/courses/{courseId}")
    public CourseResponse updateCourse(
        @PathVariable Long courseId,
        @Valid @RequestBody CourseRequest request
    ) {
        return courseService.update(courseId, request);
    }

    @PostMapping("/courses/{courseId}/submit")
    public CourseResponse submitCourse(
        @PathVariable Long courseId
    ) {
        return courseService.submit(courseId);
    }

    @DeleteMapping("/courses/{courseId}")
    public ResponseEntity<Void> deleteCourse(
        @PathVariable Long courseId
    ) {
        courseService.delete(courseId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/courses/{courseId}/modules")
    public ResponseEntity<ModuleResponse> createModule(
        @PathVariable Long courseId,
        @Valid @RequestBody ModuleRequest request
    ) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(
                contentService.createModule(courseId, request)
            );
    }

    @PostMapping("/modules/{moduleId}/lessons")
    public ResponseEntity<LessonResponse> createLesson(
        @PathVariable Long moduleId,
        @Valid @RequestBody LessonRequest request
    ) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(
                contentService.createLesson(moduleId, request)
            );
    }

    @PutMapping("/lessons/{lessonId}")
    public LessonResponse updateLesson(
        @PathVariable Long lessonId,
        @Valid @RequestBody LessonRequest request
    ) {
        return contentService.updateLesson(lessonId, request);
    }

    @DeleteMapping("/lessons/{lessonId}")
    public ResponseEntity<Void> deleteLesson(
        @PathVariable Long lessonId
    ) {
        contentService.deleteLesson(lessonId);
        return ResponseEntity.noContent().build();
    }
}
