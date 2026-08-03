package com.skillforge.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.skillforge.backend.dto.ProfileUpdateRequest;
import com.skillforge.backend.dto.UserResponse;
import com.skillforge.backend.entity.User;
import com.skillforge.backend.enums.UserStatus;
import com.skillforge.backend.exception.BadRequestException;
import com.skillforge.backend.exception.ResourceNotFoundException;
import com.skillforge.backend.repository.UserRepository;

@Service
public class UserService {

	private final UserRepository userRepository;
	private final CurrentUserService currentUserService;
	private final MappingService mappingService;

	public UserService(UserRepository userRepository, CurrentUserService currentUserService,
			MappingService mappingService) {
		this.userRepository = userRepository;
		this.currentUserService = currentUserService;
		this.mappingService = mappingService;
	}

	public UserResponse getProfile() {
		return mappingService.toUserResponse(currentUserService.getCurrentUser());
	}

	@Transactional
	public UserResponse updateProfile(ProfileUpdateRequest request) {
		User user = currentUserService.getCurrentUser();
		user.setFirstName(request.firstName().trim());
		user.setLastName(request.lastName().trim());
		user.setPhone(request.phone());
		user.setBio(request.bio());
		user.setProfilePictureUrl(request.profilePictureUrl());

		return mappingService.toUserResponse(userRepository.save(user));
	}

	public List<UserResponse> findAll() {
		return userRepository.findAll().stream().map(mappingService::toUserResponse).toList();
	}

	@Transactional
	public UserResponse updateStatus(Long userId, UserStatus status) {
		User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));

		User currentAdmin = currentUserService.getCurrentUser();

		if (user.getId().equals(currentAdmin.getId())) {
			throw new BadRequestException("You cannot change your own account status");
		}

		user.setStatus(status);

		return mappingService.toUserResponse(userRepository.save(user));
	}

	@Transactional
	public void delete(Long userId) {
		User currentAdmin = currentUserService.getCurrentUser();

		if (currentAdmin.getId().equals(userId)) {
			throw new BadRequestException("You cannot delete your own account");
		}

		User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));

		// Keep academic records intact. "Delete" is a soft delete.
		user.setStatus(UserStatus.INACTIVE);
		userRepository.save(user);
	}
}
