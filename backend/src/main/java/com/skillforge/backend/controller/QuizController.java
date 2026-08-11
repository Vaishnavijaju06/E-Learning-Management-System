package com.skillforge.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillforge.backend.dto.QuizCreateRequest;
import com.skillforge.backend.dto.QuizResponse;
import com.skillforge.backend.dto.QuizResultResponse;
import com.skillforge.backend.dto.QuizSubmissionRequest;
import com.skillforge.backend.service.QuizService;

import jakarta.validation.Valid;

@RestController
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @PostMapping("/api/instructor/modules/{moduleId}/quiz")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<QuizResponse> create(
        @PathVariable Long moduleId,
        @Valid @RequestBody QuizCreateRequest request
    ) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(quizService.create(moduleId, request));
    }

    @GetMapping("/api/instructor/modules/{moduleId}/quiz")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public QuizResponse getInstructorQuiz(
        @PathVariable Long moduleId
    ) {
        return quizService.getInstructorQuiz(moduleId);
    }

    @GetMapping("/api/quizzes/module/{moduleId}")
    @PreAuthorize("hasRole('STUDENT')")
    public QuizResponse getStudentQuiz(
        @PathVariable Long moduleId
    ) {
        return quizService.getStudentQuiz(moduleId);
    }

    @PostMapping("/api/quizzes/{quizId}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public QuizResultResponse submit(
        @PathVariable Long quizId,
        @Valid @RequestBody QuizSubmissionRequest request
    ) {
        return quizService.submit(quizId, request);
    }
}
