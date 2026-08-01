package com.skillforge.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.skillforge.backend.dto.CategoryResponse;
import com.skillforge.backend.dto.UserResponse;
import com.skillforge.backend.entity.Category;
import com.skillforge.backend.entity.User;

@Service
public class MappingService {

    private final String frontendUrl;

    public MappingService(
        @Value("${app.frontend-url}") String frontendUrl
    ) {
        this.frontendUrl = frontendUrl;
    }

    public UserResponse toUserResponse(User user) {
        return new UserResponse(
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            user.getPhone(),
            user.getBio(),
            user.getProfilePictureUrl(),
            user.getRole(),
            user.getStatus()
        );
    }
    
    public CategoryResponse toCategoryResponse(Category category) {
        return new CategoryResponse(
            category.getId(),
            category.getName(),
            category.getDescription()
        );
    }
}
