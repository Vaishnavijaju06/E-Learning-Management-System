package com.skillforge.backend.service;

import java.time.LocalDateTime;
import java.util.Locale;
import java.util.UUID;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.skillforge.backend.dto.AuthResponse;
import com.skillforge.backend.dto.LoginRequest;
import com.skillforge.backend.dto.RegisterRequest;
import com.skillforge.backend.dto.UserResponse;
import com.skillforge.backend.entity.EmailVerificationToken;
import com.skillforge.backend.entity.User;
import com.skillforge.backend.enums.Role;
import com.skillforge.backend.enums.UserStatus;
import com.skillforge.backend.exception.BadRequestException;
import com.skillforge.backend.exception.UnauthorizedException;
import com.skillforge.backend.repository.EmailVerificationTokenRepository;
import com.skillforge.backend.repository.UserRepository;
import com.skillforge.backend.security.JwtService;

@Service
public class AuthService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;
	private final JwtService jwtService;
	private final MappingService mappingService;
	private final NotificationService notificationService;
	private final EmailVerificationTokenRepository emailVerificationTokenRepository;

	public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
			AuthenticationManager authenticationManager, JwtService jwtService, MappingService mappingService,
			NotificationService notificationService,
			EmailVerificationTokenRepository emailVerificationTokenRepository) {

		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.authenticationManager = authenticationManager;
		this.jwtService = jwtService;
		this.mappingService = mappingService;
		this.notificationService = notificationService;
		this.emailVerificationTokenRepository = emailVerificationTokenRepository;
	}

	@Transactional
	public UserResponse register(RegisterRequest request) {

		if (request.role() != Role.STUDENT && request.role() != Role.INSTRUCTOR) {

			throw new BadRequestException("Only students and instructors can register");
		}

		String email = request.email().trim().toLowerCase(Locale.ROOT);

		if (userRepository.existsByEmailIgnoreCase(email)) {
			throw new BadRequestException("An account already exists with this email");
		}

		User user = new User();

		user.setFirstName(request.firstName().trim());
		user.setLastName(request.lastName().trim());
		user.setEmail(email);
		user.setPassword(passwordEncoder.encode(request.password()));
		user.setPhone(request.phone());
		user.setRole(request.role());

		user.setStatus(request.role() == Role.STUDENT ? UserStatus.ACTIVE : UserStatus.PENDING);

		user.setEnabled(false);

		userRepository.save(user);

		EmailVerificationToken verificationToken = new EmailVerificationToken();

		verificationToken.setToken(UUID.randomUUID().toString());

		verificationToken.setExpiryTime(LocalDateTime.now().plusHours(24));

		verificationToken.setUser(user);

		emailVerificationTokenRepository.save(verificationToken);

		notificationService.sendVerificationEmail(user, verificationToken.getToken());

		return mappingService.toUserResponse(user);
	}

	public AuthResponse login(LoginRequest request) {

		User user = userRepository.findByEmailIgnoreCase(request.email())
				.orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

		System.out.println("EMAIL : " + user.getEmail());

		System.out.println("PASSWORD MATCH : " + passwordEncoder.matches(request.password(), user.getPassword()));

		System.out.println("ENABLED : " + user.isEnabled());

		try {

			authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
					request.email().trim().toLowerCase(Locale.ROOT), request.password()));

		} catch (Exception e) {

			throw new UnauthorizedException("Invalid email or password");
		}

		if (!user.isEnabled()) {
			throw new UnauthorizedException("Please verify your email before logging in.");
		}

		if (user.getStatus() == UserStatus.PENDING) {
			throw new UnauthorizedException("Instructor account is waiting for admin approval.");
		}

		if (user.getStatus() == UserStatus.INACTIVE) {
			throw new UnauthorizedException("This account is inactive.");
		}

		return new AuthResponse(jwtService.generateToken(user), mappingService.toUserResponse(user));
	}

	@Transactional
	public String verifyEmail(String token) {

		EmailVerificationToken verificationToken = emailVerificationTokenRepository.findByToken(token)
				.orElseThrow(() -> new BadRequestException("Invalid verification token."));

		// Already verified
		if (verificationToken.isUsed()) {
			return "Email is already verified.";
		}

		// Expired
		if (verificationToken.getExpiryTime().isBefore(LocalDateTime.now())) {
			throw new BadRequestException("Verification link has expired.");
		}

		User user = verificationToken.getUser();

		user.setEnabled(true);

		userRepository.save(user);

		verificationToken.setUsed(true);

		emailVerificationTokenRepository.save(verificationToken);

		return "Email verified successfully.";
	}

	@Transactional
	public String resendVerificationEmail(String email) {

		User user = userRepository.findByEmailIgnoreCase(email)
				.orElseThrow(() -> new BadRequestException("User not found."));

		if (user.isEnabled()) {
			throw new BadRequestException("Email is already verified.");
		}

		emailVerificationTokenRepository.deleteByUser(user);

		EmailVerificationToken verificationToken = new EmailVerificationToken();

		verificationToken.setToken(UUID.randomUUID().toString());

		verificationToken.setExpiryTime(LocalDateTime.now().plusHours(24));

		verificationToken.setUser(user);

		emailVerificationTokenRepository.save(verificationToken);

		notificationService.sendVerificationEmail(user, verificationToken.getToken());

		return "Verification email has been sent.";
	}
}