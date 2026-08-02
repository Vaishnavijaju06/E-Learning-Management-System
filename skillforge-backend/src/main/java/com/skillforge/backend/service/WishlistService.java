package com.skillforge.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.skillforge.backend.dto.CourseResponse;
import com.skillforge.backend.entity.Course;
import com.skillforge.backend.entity.User;
import com.skillforge.backend.entity.Wishlist;
import com.skillforge.backend.enums.CourseStatus;
import com.skillforge.backend.exception.BadRequestException;
import com.skillforge.backend.repository.WishlistRepository;

@Service
public class WishlistService {

	private final WishlistRepository wishlistRepository;
	private final CourseService courseService;
	private final CurrentUserService currentUserService;
	private final MappingService mappingService;

	public WishlistService(WishlistRepository wishlistRepository, CourseService courseService,
			CurrentUserService currentUserService, MappingService mappingService) {
		this.wishlistRepository = wishlistRepository;
		this.courseService = courseService;
		this.currentUserService = currentUserService;
		this.mappingService = mappingService;
	}

	@Transactional(readOnly = true)
	public List<CourseResponse> findMine() {
		User student = currentUserService.getCurrentUser();

		return wishlistRepository.findByStudentIdOrderByCreatedAtDesc(student.getId()).stream().map(Wishlist::getCourse)
				.map(mappingService::toCourseResponse).toList();
	}

	@Transactional
	public CourseResponse add(Long courseId) {
		User student = currentUserService.getCurrentUser();
		Course course = courseService.findEntity(courseId);

		if (course.getStatus() != CourseStatus.APPROVED) {
			throw new BadRequestException("Only approved courses can be wishlisted");
		}

		if (wishlistRepository.existsByStudentIdAndCourseId(student.getId(), courseId)) {
			return mappingService.toCourseResponse(course);
		}

		Wishlist wishlist = new Wishlist();
		wishlist.setStudent(student);
		wishlist.setCourse(course);
		wishlistRepository.save(wishlist);

		return mappingService.toCourseResponse(course);
	}

	@Transactional
	public void remove(Long courseId) {
		User student = currentUserService.getCurrentUser();

		wishlistRepository.findByStudentIdAndCourseId(student.getId(), courseId).ifPresent(wishlistRepository::delete);
	}
}
