package com.skillforge.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skillforge.backend.entity.Discussion;

public interface DiscussionRepository
        extends JpaRepository<Discussion, Long> {

    List<Discussion>
        findByCourseIdOrderByCreatedAtDesc(Long courseId);

    List<Discussion>
        findByStudentIdOrderByCreatedAtDesc(Long studentId);

    Optional<Discussion>
        findByIdAndStudentId(
            Long discussionId,
            Long studentId
        );
}