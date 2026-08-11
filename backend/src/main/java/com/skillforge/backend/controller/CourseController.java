package com.skillforge.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.skillforge.backend.dto.CourseResponse;
import com.skillforge.backend.service.CourseService;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public List<CourseResponse> findApproved(
        @RequestParam(required = false) String search
    ) {
        return courseService.findApproved(search);
    }

    @GetMapping("/{courseId}")
    public CourseResponse findById(
        @PathVariable Long courseId
    ) {
        return courseService.findApprovedById(courseId);
    }
}
