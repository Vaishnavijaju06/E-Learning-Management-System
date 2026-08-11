package com.skillforge.backend.dto;

import java.time.LocalDateTime;

public record DiscussionReplyResponse(

    Long id,

    Long authorId,

    String authorName,

    String authorRole,

    String message,

    LocalDateTime createdAt

) {
}