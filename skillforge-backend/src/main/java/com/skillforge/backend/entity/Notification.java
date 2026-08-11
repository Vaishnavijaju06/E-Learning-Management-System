package com.skillforge.backend.entity;

import java.time.LocalDateTime;

import com.skillforge.backend.enums.NotificationType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "notifications")
public class Notification extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "recipient_user_id",
        nullable = false
    )
    private User recipient;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 1000)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private NotificationType type;

    private Long referenceId;

    @Column(length = 50)
    private String referenceType;

    @Column(length = 300)
    private String actionUrl;

    @Column(name = "is_read", nullable = false)
    private boolean read = false;

    private LocalDateTime readAt;
}