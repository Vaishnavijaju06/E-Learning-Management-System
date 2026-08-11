package com.skillforge.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skillforge.backend.entity.CourseModule;

public interface CourseModuleRepository
    extends JpaRepository<CourseModule, Long> {

    List<CourseModule> findByCourseIdOrderByPositionAsc(Long courseId);

    long countByCourseId(Long courseId);
}
