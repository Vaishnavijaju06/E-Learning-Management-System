package com.skillforge.backend.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Locale;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.skillforge.backend.enums.NotificationType;

import com.skillforge.backend.dto.AuthResponse;
import com.skillforge.backend.dto.LoginRequest;
import com.skillforge.backend.dto.RegisterRequest;
import com.skillforge.backend.dto.UserResponse;
import com.skillforge.backend.entity.PasswordResetToken;
import com.skillforge.backend.entity.User;
import com.skillforge.backend.enums.Role;
import com.skillforge.backend.enums.UserStatus;
import com.skillforge.backend.exception.BadRequestException;
import com.skillforge.backend.exception.UnauthorizedException;
import com.skillforge.backend.repository.PasswordResetTokenRepository;
import com.skillforge.backend.repository.UserRepository;
import com.skillforge.backend.security.JwtService;

@Service
public class AuthService {

    private static final int RESET_TOKEN_VALID_MINUTES = 30;
    private static final SecureRandom SECURE_RANDOM =
        new SecureRandom();

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository
        passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final MappingService mappingService;
    private final NotificationService notificationService;
    private final InAppNotificationService inAppNotificationService;

    public AuthService(
        UserRepository userRepository,
        PasswordResetTokenRepository passwordResetTokenRepository,
        PasswordEncoder passwordEncoder,
        AuthenticationManager authenticationManager,
        JwtService jwtService,
        MappingService mappingService,
        NotificationService notificationService,
        InAppNotificationService inAppNotificationService
    ) {
        this.userRepository = userRepository;
        this.passwordResetTokenRepository =
            passwordResetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.mappingService = mappingService;
        this.notificationService = notificationService;
        this.inAppNotificationService = inAppNotificationService;
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (
            request.role() != Role.STUDENT
            && request.role() != Role.INSTRUCTOR
        ) {
            throw new BadRequestException(
                "Only students and instructors can register"
            );
        }

        String email = request.email()
            .trim()
            .toLowerCase(Locale.ROOT);

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new BadRequestException(
                "An account already exists with this email"
            );
        }

        User user = new User();
        user.setFirstName(request.firstName().trim());
        user.setLastName(request.lastName().trim());
        user.setEmail(email);
        user.setPassword(
            passwordEncoder.encode(request.password())
        );
        user.setPhone(request.phone());
        user.setRole(request.role());
        user.setStatus(
            request.role() == Role.STUDENT
                ? UserStatus.ACTIVE
                : UserStatus.PENDING
        );

        User savedUser = userRepository.save(user);

        notificationService.sendWelcome(savedUser);

        if (savedUser.getRole() == Role.INSTRUCTOR) {
            User finalSavedUser = savedUser;

            userRepository
                .findByRoleOrderByCreatedAtDesc(Role.ADMIN)
                .forEach(admin ->
                    inAppNotificationService.notifyUser(
                        admin,
                        "New instructor registration",
                        finalSavedUser.getFirstName()
                            + " "
                            + finalSavedUser.getLastName()
                            + " registered as an instructor.",
                        NotificationType.INSTRUCTOR_REGISTERED,
                        finalSavedUser.getId(),
                        "USER",
                        "/admin/manage"
                    )
                );
        }

        return mappingService.toUserResponse(savedUser);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository
            .findByEmailIgnoreCase(request.email())
            .orElseThrow(() ->
                new UnauthorizedException(
                    "Invalid email or password"
                )
            );

        if (user.getStatus() == UserStatus.PENDING) {
            throw new UnauthorizedException(
                "Instructor account is waiting for admin approval"
            );
        }

        if (user.getStatus() == UserStatus.INACTIVE) {
            throw new UnauthorizedException(
                "This account is inactive"
            );
        }

        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.email(),
                    request.password()
                )
            );
        } catch (Exception exception) {
            throw new UnauthorizedException(
                "Invalid email or password"
            );
        }

        return new AuthResponse(
            jwtService.generateToken(user),
            mappingService.toUserResponse(user)
        );
    }

    @Transactional
    public void forgotPassword(String email) {
        String normalizedEmail = email
            .trim()
            .toLowerCase(Locale.ROOT);

        userRepository
            .findByEmailIgnoreCase(normalizedEmail)
            .ifPresent(user -> {
                // Invalidate any earlier unused reset links first,
                // so only the most recent one works.
                passwordResetTokenRepository
                    .invalidateActiveTokensForUser(user.getId());

                PasswordResetToken resetToken =
                    new PasswordResetToken();
                resetToken.setUser(user);
                resetToken.setToken(generateResetToken());
                resetToken.setExpiresAt(
                    LocalDateTime.now()
                        .plusMinutes(RESET_TOKEN_VALID_MINUTES)
                );

                passwordResetTokenRepository.save(resetToken);

                notificationService.sendPasswordReset(
                    user,
                    resetToken.getToken()
                );
            });

        /*
         * Always respond the same way whether or not the email
         * exists, so the endpoint can't be used to find out which
         * emails are registered.
         */
    }

    @Transactional
    public void resetPassword(
        String token,
        String newPassword
    ) {
        PasswordResetToken resetToken =
            passwordResetTokenRepository
                .findByToken(token)
                .orElseThrow(() ->
                    new BadRequestException(
                        "This password reset link is invalid"
                    )
                );

        if (resetToken.isUsed()) {
            throw new BadRequestException(
                "This password reset link has already been used"
            );
        }

        if (
            resetToken.getExpiresAt()
                .isBefore(LocalDateTime.now())
        ) {
            throw new BadRequestException(
                "This password reset link has expired. "
                + "Please request a new one."
            );
        }

        User user = resetToken.getUser();
        user.setPassword(
            passwordEncoder.encode(newPassword)
        );
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
    }

    private String generateResetToken() {
        byte[] bytes = new byte[32];
        SECURE_RANDOM.nextBytes(bytes);

        StringBuilder builder = new StringBuilder();
        for (byte value : bytes) {
            builder.append(
                String.format("%02x", value)
            );
        }

        return builder.toString();
    }
}