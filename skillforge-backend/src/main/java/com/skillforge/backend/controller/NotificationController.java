package com.skillforge.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillforge.backend.dto.NotificationResponse;
import com.skillforge.backend.entity.User;
import com.skillforge.backend.service.CurrentUserService;
import com.skillforge.backend.service.InAppNotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class NotificationController {

    private final InAppNotificationService notificationService;
    private final CurrentUserService currentUserService;

    /*
     * Returns all notifications of the logged-in user.
     */
    @GetMapping
    public ResponseEntity<List<NotificationResponse>>
        getMyNotifications() {

        User currentUser =
            currentUserService.getCurrentUser();

        List<NotificationResponse> notifications =
            notificationService.getNotifications(currentUser);

        return ResponseEntity.ok(notifications);
    }

    /*
     * Returns only unread notifications.
     */
    @GetMapping("/unread")
    public ResponseEntity<List<NotificationResponse>>
        getUnreadNotifications() {

        User currentUser =
            currentUserService.getCurrentUser();

        List<NotificationResponse> notifications =
            notificationService.getUnreadNotifications(
                currentUser
            );

        return ResponseEntity.ok(notifications);
    }

    /*
     * Returns the unread notification badge count.
     */
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>>
        getUnreadCount() {

        User currentUser =
            currentUserService.getCurrentUser();

        long unreadCount =
            notificationService.getUnreadCount(currentUser);

        return ResponseEntity.ok(
            Map.of("unreadCount", unreadCount)
        );
    }

    /*
     * Marks one notification as read.
     */
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<NotificationResponse>
        markAsRead(
            @PathVariable Long notificationId
        ) {

        User currentUser =
            currentUserService.getCurrentUser();

        NotificationResponse response =
            notificationService.markAsRead(
                notificationId,
                currentUser
            );

        return ResponseEntity.ok(response);
    }

    /*
     * Marks all notifications as read.
     */
    @PutMapping("/read-all")
    public ResponseEntity<Map<String, String>>
        markAllAsRead() {

        User currentUser =
            currentUserService.getCurrentUser();

        notificationService.markAllAsRead(currentUser);

        return ResponseEntity.ok(
            Map.of(
                "message",
                "All notifications marked as read"
            )
        );
    }

    /*
     * Deletes one notification belonging to the logged-in user.
     */
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(
        @PathVariable Long notificationId
    ) {

        User currentUser =
            currentUserService.getCurrentUser();

        notificationService.deleteNotification(
            notificationId,
            currentUser
        );

        return ResponseEntity.noContent().build();
    }
}