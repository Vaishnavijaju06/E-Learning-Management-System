package com.skillforge.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skillforge.backend.entity.LessonProgress;

public interface LessonProgressRepository
    extends JpaRepository<LessonProgress, Long> {

    Optional<LessonProgress> findByEnrollmentIdAndLessonId(
        Long enrollmentId,
        Long lessonId
    );

    List<LessonProgress> findByEnrollmentId(Long enrollmentId);

    long countByEnrollmentIdAndCompletedTrue(Long enrollmentId);
}
