package com.skillforge.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.skillforge.backend.enums.DiscussionStatus;

public record DiscussionResponse(

    Long id,

    Long courseId,

    String courseTitle,

    Long studentId,

    String studentName,

    String title,

    String message,

    DiscussionStatus status,

    LocalDateTime createdAt,

    LocalDateTime updatedAt,

    List<DiscussionReplyResponse> replies

) {
}