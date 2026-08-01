package com.skillforge.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.skillforge.backend.dto.UserResponse;
import com.skillforge.backend.enums.UserStatus;
import com.skillforge.backend.service.UserService;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserResponse> findAll() {
        return userService.findAll();
    }

    @PatchMapping("/{userId}/status")
    public UserResponse updateStatus(
        @PathVariable Long userId,
        @RequestParam UserStatus status
    ) {
        return userService.updateStatus(userId, status);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> delete(
        @PathVariable Long userId
    ) {
        userService.delete(userId);
        return ResponseEntity.noContent().build();
    }
}
