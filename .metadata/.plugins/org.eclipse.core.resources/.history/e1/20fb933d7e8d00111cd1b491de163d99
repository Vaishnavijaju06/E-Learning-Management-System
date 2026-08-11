package com.skillforge.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.skillforge.backend.dto.CategoryRequest;
import com.skillforge.backend.dto.CategoryResponse;
import com.skillforge.backend.entity.Category;
import com.skillforge.backend.exception.BadRequestException;
import com.skillforge.backend.exception.ResourceNotFoundException;
import com.skillforge.backend.repository.CategoryRepository;
import com.skillforge.backend.repository.CourseRepository;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CourseRepository courseRepository;
    private final MappingService mappingService;

    public CategoryService(
        CategoryRepository categoryRepository,
        CourseRepository courseRepository,
        MappingService mappingService
    ) {
        this.categoryRepository = categoryRepository;
        this.courseRepository = courseRepository;
        this.mappingService = mappingService;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> findAll() {
        return categoryRepository
            .findAllByOrderByNameAsc()
            .stream()
            .map(mappingService::toCategoryResponse)
            .toList();
    }

    @Transactional
    public CategoryResponse create(CategoryRequest request) {
        if (
            categoryRepository.existsByNameIgnoreCase(
                request.name().trim()
            )
        ) {
            throw new BadRequestException(
                "Category name already exists"
            );
        }

        Category category = new Category();
        category.setName(request.name().trim());
        category.setDescription(request.description());

        return mappingService.toCategoryResponse(
            categoryRepository.save(category)
        );
    }

    @Transactional
    public CategoryResponse update(
        Long categoryId,
        CategoryRequest request
    ) {
        Category category = findEntity(categoryId);

        categoryRepository
            .findByNameIgnoreCase(request.name().trim())
            .filter(found -> !found.getId().equals(categoryId))
            .ifPresent(found -> {
                throw new BadRequestException(
                    "Category name already exists"
                );
            });

        category.setName(request.name().trim());
        category.setDescription(request.description());

        return mappingService.toCategoryResponse(
            categoryRepository.save(category)
        );
    }

    @Transactional
    public void delete(Long categoryId) {
        Category category = findEntity(categoryId);

        if (courseRepository.existsByCategoryId(categoryId)) {
            throw new BadRequestException(
                "A category used by a course cannot be deleted"
            );
        }

        categoryRepository.delete(category);
    }

    public Category findEntity(Long categoryId) {
        return categoryRepository
            .findById(categoryId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Category not found"
                )
            );
    }
}
