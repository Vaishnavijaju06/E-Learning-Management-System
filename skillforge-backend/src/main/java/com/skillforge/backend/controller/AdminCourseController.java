package com.skillforge.backend.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.skillforge.backend.dto.CourseResponse;
import com.skillforge.backend.enums.CourseStatus;
import com.skillforge.backend.service.CourseService;

@RestController
@RequestMapping("/api/admin/courses")
@PreAuthorize("hasRole('ADMIN')")
public class AdminCourseController {

    private final CourseService courseService;

    public AdminCourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping("/pending")
    public List<CourseResponse> findPending() {
        return courseService.findPendingCourses();
    }

    @PatchMapping("/{courseId}/status")
    public CourseResponse updateStatus(
        @PathVariable Long courseId,
        @RequestParam CourseStatus status
    ) {
        return courseService.updateStatus(courseId, status);
    }
}
