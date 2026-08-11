package com.skillforge.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skillforge.backend.entity.Enrollment;
import com.skillforge.backend.enums.EnrollmentStatus;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    // --- Student Enrollment Verification ---
    Optional<Enrollment> findByStudentIdAndCourseId(
        Long studentId,
        Long courseId
    );

    boolean existsByStudentIdAndCourseId(
        Long studentId,
        Long courseId
    );

    // --- Student Queries ---
    List<Enrollment> findByStudentIdOrderByEnrolledAtDesc(Long studentId);

    List<Enrollment> findByStudentIdAndStatusOrderByEnrolledAtDesc(
        Long studentId,
        EnrollmentStatus status
    );

    // --- Instructor Queries ---
    // Traverses Enrollment -> Course -> Instructor -> ID
    List<Enrollment> findByCourseInstructorIdOrderByEnrolledAtDesc(Long instructorId);

    // --- Course-Level Queries ---
    List<Enrollment> findByCourseId(Long courseId);

    // --- Analytics & Counting Helpers ---
    long countByStudentId(Long studentId);

    long countByCourseId(Long courseId);

    long countByCourseInstructorId(Long instructorId);
}