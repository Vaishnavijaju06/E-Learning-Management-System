package com.skillforge.backend.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.skillforge.backend.entity.User;
import com.skillforge.backend.exception.UnauthorizedException;
import com.skillforge.backend.repository.UserRepository;

@Service
public class CurrentUserService {

    private final UserRepository userRepository;

    public CurrentUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder
            .getContext()
            .getAuthentication();

        if (
            authentication == null
            || !authentication.isAuthenticated()
            || "anonymousUser".equals(authentication.getPrincipal())
        ) {
            throw new UnauthorizedException(
                "Authentication is required"
            );
        }

        return userRepository
            .findByEmailIgnoreCase(authentication.getName())
            .orElseThrow(() ->
                new UnauthorizedException("Authenticated user not found")
            );
    }
}
