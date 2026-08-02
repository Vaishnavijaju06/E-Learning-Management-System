package com.skillforge.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skillforge.backend.entity.Wishlist;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    Optional<Wishlist> findByStudentIdAndCourseId(
        Long studentId,
        Long courseId
    );

    List<Wishlist> findByStudentIdOrderByCreatedAtDesc(Long studentId);

    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);

    void deleteByCourseId(Long courseId);
}
