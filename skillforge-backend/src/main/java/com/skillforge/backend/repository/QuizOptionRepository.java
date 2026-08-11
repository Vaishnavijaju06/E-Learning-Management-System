package com.skillforge.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skillforge.backend.entity.QuizOption;

public interface QuizOptionRepository
    extends JpaRepository<QuizOption, Long> {

    List<QuizOption> findByQuestionIdOrderByIdAsc(Long questionId);

    Optional<QuizOption> findByIdAndQuestionId(
        Long optionId,
        Long questionId
    );
}
