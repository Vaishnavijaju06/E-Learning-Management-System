package com.skillforge.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillforge.backend.dto.ProfileUpdateRequest;
import com.skillforge.backend.dto.UserResponse;
import com.skillforge.backend.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserService userService;

    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public UserResponse getProfile() {
        return userService.getProfile();
    }

    @PutMapping
    public UserResponse updateProfile(
        @Valid @RequestBody ProfileUpdateRequest request
    ) {
        return userService.updateProfile(request);
    }
}
