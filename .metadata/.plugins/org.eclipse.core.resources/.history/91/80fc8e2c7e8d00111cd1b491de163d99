package com.skillforge.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skillforge.backend.entity.Course;
import com.skillforge.backend.enums.CourseStatus;

public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByStatusOrderByCreatedAtDesc(CourseStatus status);

    List<Course> findByInstructorIdOrderByCreatedAtDesc(Long instructorId);

    List<Course> findByStatusAndTitleContainingIgnoreCaseOrderByCreatedAtDesc(
        CourseStatus status,
        String title
    );

    long countByInstructorId(Long instructorId);

    long countByStatus(CourseStatus status);

    boolean existsByCategoryId(Long categoryId);
}
