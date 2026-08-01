package com.skillforge.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.skillforge.backend.dto.CategoryRequest;
import com.skillforge.backend.dto.CategoryResponse;
import com.skillforge.backend.entity.Category;
import com.skillforge.backend.exception.BadRequestException;
import com.skillforge.backend.exception.ResourceNotFoundException;
import com.skillforge.backend.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {

	@Autowired
    private final CategoryRepository categoryRepository;
    private final MappingService mappingService;

    

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
