package com.skillforge.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillforge.backend.dto.AuthResponse;
import com.skillforge.backend.dto.LoginRequest;
import com.skillforge.backend.dto.RegisterRequest;
import com.skillforge.backend.dto.UserResponse;
import com.skillforge.backend.service.AuthService;
import com.skillforge.backend.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
    private final AuthService authService;
    private final UserService userService;

   

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
}
