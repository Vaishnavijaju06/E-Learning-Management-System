package com.skillforge.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillforge.backend.dto.AuthResponse;
import com.skillforge.backend.dto.ForgotPasswordRequest;
import com.skillforge.backend.dto.LoginRequest;
import com.skillforge.backend.dto.MessageResponse;
import com.skillforge.backend.dto.RegisterRequest;
import com.skillforge.backend.dto.ResetPasswordRequest;
import com.skillforge.backend.dto.UserResponse;
import com.skillforge.backend.service.AuthService;
import com.skillforge.backend.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    public AuthController(
        AuthService authService,
        UserService userService
    ) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
        @Valid @RequestBody RegisterRequest request
    ) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(authService.register(request));
    }

    @PostMapping("/login")
    public AuthResponse login(
        @Valid @RequestBody LoginRequest request
    ) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public UserResponse me() {
        return userService.getProfile();
    }

    @PostMapping("/forgot-password")
    public MessageResponse forgotPassword(
        @Valid @RequestBody ForgotPasswordRequest request
    ) {
        authService.forgotPassword(request.email());

        return new MessageResponse(
            "If an account exists for that email, "
            + "a password reset link has been sent."
        );
    }

    @PostMapping("/reset-password")
    public MessageResponse resetPassword(
        @Valid @RequestBody ResetPasswordRequest request
    ) {
        authService.resetPassword(
            request.token(),
            request.newPassword()
        );

        return new MessageResponse(
            "Your password has been reset. You can now log in."
        );
    }
}