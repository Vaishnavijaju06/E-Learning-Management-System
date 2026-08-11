package com.skillforge.backend.dto;

import java.math.BigDecimal;

import com.skillforge.backend.enums.CourseLevel;
import com.skillforge.backend.enums.CourseStatus;

public record CourseResponse(
    Long id,
    String title,
    String description,
    BigDecimal price,
    CourseLevel level,
    CourseStatus status,
    String thumbnailUrl,
    Long categoryId,
    String categoryName,
    Long instructorId,
    String instructorName
) {
}
