package com.skillforge.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skillforge.backend.entity.Notification;
import com.skillforge.backend.entity.User;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification>
        findByRecipientOrderByCreatedAtDesc(User recipient);

    List<Notification>
        findByRecipientAndReadFalseOrderByCreatedAtDesc(
            User recipient
        );

    long countByRecipientAndReadFalse(User recipient);

    Optional<Notification>
        findByIdAndRecipient(
            Long id,
            User recipient
        );
}