package com.skillforge.backend.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.skillforge.backend.entity.User;
import com.skillforge.backend.enums.UserStatus;
import com.skillforge.backend.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(
        UserRepository userRepository
    ) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) {
        User user = userRepository
            .findByEmailIgnoreCase(email)
            .orElseThrow(() ->
                new UsernameNotFoundException("User not found")
            );

        return org.springframework.security.core.userdetails.User
            .withUsername(user.getEmail())
            .password(user.getPassword())
            .roles(user.getRole().name())
            .disabled(user.getStatus() != UserStatus.ACTIVE)
            .build();
    }
}
