package com.skillforge.backend.dto;

import java.time.LocalDateTime;

import com.skillforge.backend.enums.NotificationType;

public record NotificationResponse(

    Long id,

    String title,

    String message,

    NotificationType type,

    Long referenceId,

    String referenceType,

    String actionUrl,

    boolean read,

    LocalDateTime createdAt,

    LocalDateTime readAt

) {
}