package com.skillforge.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.skillforge.backend.entity.Course;
import com.skillforge.backend.enums.CourseStatus;

public interface CourseRepository extends JpaRepository<Course, Long> {

	// --- Public Catalog & Search Queries ---
	List<Course> findByStatusOrderByCreatedAtDesc(CourseStatus status);

	List<Course> findByStatusAndTitleContainingIgnoreCaseOrderByCreatedAtDesc(CourseStatus status, String title);

	// Eagerly fetches modules and lessons in a single SQL query to prevent N+1
	// issues when building context
	@Query("SELECT DISTINCT c FROM Course c LEFT JOIN FETCH c.modules m LEFT JOIN FETCH m.lessons WHERE c.status = :status ORDER BY c.createdAt DESC")
	List<Course> findApprovedCoursesWithModulesAndLessons(@Param("status") CourseStatus status);

	// --- Instructor Queries ---
	List<Course> findByInstructorIdOrderByCreatedAtDesc(Long instructorId);

	List<Course> findByInstructorIdAndStatusOrderByCreatedAtDesc(Long instructorId, CourseStatus status);

	// --- Analytics, Verification & Counting Helpers ---
	long countByInstructorId(Long instructorId);

	long countByStatus(CourseStatus status);

	boolean existsByCategoryId(Long categoryId);
}