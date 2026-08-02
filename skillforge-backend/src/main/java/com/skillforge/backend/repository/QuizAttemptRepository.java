package com.skillforge.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skillforge.backend.entity.QuizAttempt;

public interface QuizAttemptRepository
    extends JpaRepository<QuizAttempt, Long> {

    long countByQuizIdAndStudentId(Long quizId, Long studentId);

    boolean existsByQuizIdAndStudentIdAndPassedTrue(
        Long quizId,
        Long studentId
    );
}
