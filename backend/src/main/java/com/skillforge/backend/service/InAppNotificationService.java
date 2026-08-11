package com.skillforge.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.skillforge.backend.dto.NotificationResponse;
import com.skillforge.backend.entity.Notification;
import com.skillforge.backend.entity.User;
import com.skillforge.backend.enums.NotificationType;
import com.skillforge.backend.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InAppNotificationService {

    private final NotificationRepository notificationRepository;

    /*
     * Creates and saves a notification for one user.
     */
    @Transactional
    public NotificationResponse notifyUser(
        User recipient,
        String title,
        String message,
        NotificationType type,
        Long referenceId,
        String referenceType,
        String actionUrl
    ) {
        if (recipient == null) {
            throw new IllegalArgumentException(
                "Notification recipient is required"
            );
        }

        Notification notification = new Notification();

        notification.setRecipient(recipient);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setReferenceId(referenceId);
        notification.setReferenceType(referenceType);
        notification.setActionUrl(actionUrl);
        notification.setRead(false);

        Notification savedNotification =
            notificationRepository.save(notification);

        return mapToResponse(savedNotification);
    }

    /*
     * Returns every notification belonging to the user.
     */
    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotifications(
        User currentUser
    ) {
        return notificationRepository
            .findByRecipientOrderByCreatedAtDesc(currentUser)
            .stream()
            .map(this::mapToResponse)
            .toList();
    }

    /*
     * Returns only unread notifications.
     */
    @Transactional(readOnly = true)
    public List<NotificationResponse> getUnreadNotifications(
        User currentUser
    ) {
        return notificationRepository
            .findByRecipientAndReadFalseOrderByCreatedAtDesc(
                currentUser
            )
            .stream()
            .map(this::mapToResponse)
            .toList();
    }

    /*
     * Returns the unread badge count.
     */
    @Transactional(readOnly = true)
    public long getUnreadCount(User currentUser) {
        return notificationRepository
            .countByRecipientAndReadFalse(currentUser);
    }

    /*
     * Marks one notification as read.
     *
     * findByIdAndRecipient ensures a user cannot update another
     * user's notification.
     */
    @Transactional
    public NotificationResponse markAsRead(
        Long notificationId,
        User currentUser
    ) {
        Notification notification =
            notificationRepository
                .findByIdAndRecipient(
                    notificationId,
                    currentUser
                )
                .orElseThrow(
                    () -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Notification not found"
                    )
                );

        if (!notification.isRead()) {
            notification.setRead(true);
            notification.setReadAt(LocalDateTime.now());
        }

        return mapToResponse(notification);
    }

    /*
     * Marks every unread notification of the user as read.
     */
    @Transactional
    public void markAllAsRead(User currentUser) {
        List<Notification> notifications =
            notificationRepository
                .findByRecipientAndReadFalseOrderByCreatedAtDesc(
                    currentUser
                );

        LocalDateTime currentTime = LocalDateTime.now();

        notifications.forEach(notification -> {
            notification.setRead(true);
            notification.setReadAt(currentTime);
        });

        notificationRepository.saveAll(notifications);
    }

    /*
     * Deletes only a notification belonging to the current user.
     */
    @Transactional
    public void deleteNotification(
        Long notificationId,
        User currentUser
    ) {
        Notification notification =
            notificationRepository
                .findByIdAndRecipient(
                    notificationId,
                    currentUser
                )
                .orElseThrow(
                    () -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Notification not found"
                    )
                );

        notificationRepository.delete(notification);
    }

    private NotificationResponse mapToResponse(
        Notification notification
    ) {
        return new NotificationResponse(
            notification.getId(),
            notification.getTitle(),
            notification.getMessage(),
            notification.getType(),
            notification.getReferenceId(),
            notification.getReferenceType(),
            notification.getActionUrl(),
            notification.isRead(),
            notification.getCreatedAt(),
            notification.getReadAt()
        );
    }
}