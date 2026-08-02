package com.skillforge.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillforge.backend.dto.CourseResponse;
import com.skillforge.backend.service.WishlistService;

@RestController
@RequestMapping("/api/wishlist")
@PreAuthorize("hasRole('STUDENT')")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    public List<CourseResponse> findMine() {
        return wishlistService.findMine();
    }

    @PostMapping("/{courseId}")
    public CourseResponse add(@PathVariable Long courseId) {
        return wishlistService.add(courseId);
    }

    @DeleteMapping("/{courseId}")
    public ResponseEntity<Void> remove(
        @PathVariable Long courseId
    ) {
        wishlistService.remove(courseId);
        return ResponseEntity.noContent().build();
    }
}
