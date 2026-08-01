package com.skillforge.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
import com.skillforge.backend.service.CourseService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/instructor")
@PreAuthorize("hasRole('INSTRUCTOR')")
@RequiredArgsConstructor
public class InstructorCourseController {

	@Autowired
    private final CourseService courseService;
  
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

    
}
