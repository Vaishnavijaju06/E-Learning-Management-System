package com.skillforge.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.skillforge.backend.entity.Assignment;

public interface AssignmentRepository
        extends JpaRepository<Assignment, Long> {

    List<Assignment>
        findByInstructorIdOrderByCreatedAtDesc(
            Long instructorId
        );

    List<Assignment>
        findByCourseIdOrderByCreatedAtDesc(
            Long courseId
        );

    @Query("""
        select a
        from Assignment a
        where a.status =
            com.skillforge.backend.enums.AssignmentStatus.PUBLISHED
        and exists (
            select e.id
            from Enrollment e
            where e.student.id = :studentId
            and e.course.id = a.course.id
        )
        order by a.dueDate asc
    """)
    List<Assignment> findPublishedForStudent(
        @Param("studentId") Long studentId
    );
}