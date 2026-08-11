package com.skillforge.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skillforge.backend.entity.AssignmentSubmission;

public interface AssignmentSubmissionRepository
        extends JpaRepository<AssignmentSubmission, Long> {

    List<AssignmentSubmission>
        findByAssignmentIdOrderBySubmittedAtDesc(
            Long assignmentId
        );

    List<AssignmentSubmission>
        findByStudentIdOrderBySubmittedAtDesc(
            Long studentId
        );

    Optional<AssignmentSubmission>
        findByAssignmentIdAndStudentId(
            Long assignmentId,
            Long studentId
        );
}