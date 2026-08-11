package com.skillforge.backend.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.core.io.Resource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.skillforge.backend.dto.AssignmentEvaluationRequest;
import com.skillforge.backend.dto.AssignmentResponse;
import com.skillforge.backend.dto.AssignmentSubmissionResponse;
import com.skillforge.backend.service.AssignmentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;

    @PostMapping(
        value = "/instructor/assignments",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public AssignmentResponse createAssignment(
        @RequestParam Long courseId,
        @RequestParam String title,
        @RequestParam String description,
        @RequestParam Integer maximumMarks,
        @RequestParam
        @DateTimeFormat(
            iso = DateTimeFormat.ISO.DATE_TIME
        )
        LocalDateTime dueDate,
        @RequestPart(
            value = "file",
            required = false
        )
        MultipartFile file
    ) {
        return assignmentService.createAssignment(
            courseId,
            title,
            description,
            maximumMarks,
            dueDate,
            file
        );
    }

    @GetMapping("/instructor/assignments")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public List<AssignmentResponse>
        instructorAssignments() {

        return assignmentService
            .getInstructorAssignments();
    }

    @PutMapping(
        "/instructor/assignments/{assignmentId}/publish"
    )
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public AssignmentResponse publish(
        @PathVariable Long assignmentId
    ) {
        return assignmentService
            .publishAssignment(assignmentId);
    }

    @PutMapping(
        "/instructor/assignments/{assignmentId}/close"
    )
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public AssignmentResponse close(
        @PathVariable Long assignmentId
    ) {
        return assignmentService
            .closeAssignment(assignmentId);
    }

    @DeleteMapping(
        "/instructor/assignments/{assignmentId}"
    )
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public Map<String, String> delete(
        @PathVariable Long assignmentId
    ) {
        assignmentService
            .deleteAssignment(assignmentId);

        return Map.of(
            "message",
            "Assignment deleted successfully"
        );
    }

    @GetMapping(
        "/instructor/assignments/{assignmentId}/submissions"
    )
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public List<AssignmentSubmissionResponse>
        submissions(
            @PathVariable Long assignmentId
        ) {

        return assignmentService
            .getAssignmentSubmissions(
                assignmentId
            );
    }

    @PutMapping(
        "/instructor/submissions/{submissionId}/evaluate"
    )
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public AssignmentSubmissionResponse evaluate(
        @PathVariable Long submissionId,
        @Valid
        @RequestBody
        AssignmentEvaluationRequest request
    ) {
        return assignmentService.evaluate(
            submissionId,
            request
        );
    }

    @GetMapping("/student/assignments")
    @PreAuthorize("hasRole('STUDENT')")
    public List<AssignmentResponse>
        studentAssignments() {

        return assignmentService
            .getStudentAssignments();
    }

    @PostMapping(
        value =
            "/student/assignments/{assignmentId}/submit",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @PreAuthorize("hasRole('STUDENT')")
    public AssignmentSubmissionResponse submit(
        @PathVariable Long assignmentId,
        @RequestParam(
            required = false,
            defaultValue = ""
        )
        String comment,
        @RequestPart("file")
        MultipartFile file
    ) {
        return assignmentService.submitAssignment(
            assignmentId,
            comment,
            file
        );
    }

    @GetMapping("/student/submissions")
    @PreAuthorize("hasRole('STUDENT')")
    public List<AssignmentSubmissionResponse>
        mySubmissions() {

        return assignmentService
            .getMySubmissions();
    }

    @GetMapping(
        "/assignments/{assignmentId}/download"
    )
    @PreAuthorize(
        "hasAnyRole('STUDENT','INSTRUCTOR')"
    )
    public ResponseEntity<Resource>
        downloadAssignment(
            @PathVariable Long assignmentId
        ) {

        Resource resource =
            assignmentService
                .getAssignmentFile(assignmentId);

        return ResponseEntity.ok()
            .header(
                HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\""
                    + resource.getFilename()
                    + "\""
            )
            .contentType(
                MediaType.APPLICATION_OCTET_STREAM
            )
            .body(resource);
    }

    @GetMapping(
        "/submissions/{submissionId}/download"
    )
    @PreAuthorize(
        "hasAnyRole('STUDENT','INSTRUCTOR')"
    )
    public ResponseEntity<Resource>
        downloadSubmission(
            @PathVariable Long submissionId
        ) {

        Resource resource =
            assignmentService
                .getSubmissionFile(submissionId);

        return ResponseEntity.ok()
            .header(
                HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\""
                    + resource.getFilename()
                    + "\""
            )
            .contentType(
                MediaType.APPLICATION_OCTET_STREAM
            )
            .body(resource);
    }
}