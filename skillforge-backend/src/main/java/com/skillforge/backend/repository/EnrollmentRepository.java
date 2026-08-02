package com.skillforge.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skillforge.backend.entity.Enrollment;

public interface EnrollmentRepository
    extends JpaRepository<Enrollment, Long> {

    Optional<Enrollment> findByStudentIdAndCourseId(
        Long studentId,
        Long courseId
    );

    boolean existsByStudentIdAndCourseId(
        Long studentId,
        Long courseId
    );

    List<Enrollment> findByStudentIdOrderByEnrolledAtDesc(Long studentId);

    long countByStudentId(Long studentId);

    long countByCourseId(Long courseId);

    long countByCourseInstructorId(Long instructorId);
}
