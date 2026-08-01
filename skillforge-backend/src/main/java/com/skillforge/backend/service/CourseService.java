package com.skillforge.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.skillforge.backend.dto.CourseRequest;
import com.skillforge.backend.dto.CourseResponse;
import com.skillforge.backend.entity.Category;
import com.skillforge.backend.entity.Course;
import com.skillforge.backend.entity.User;
import com.skillforge.backend.enums.CourseStatus;
import com.skillforge.backend.enums.Role;
import com.skillforge.backend.exception.BadRequestException;
import com.skillforge.backend.exception.ForbiddenException;
import com.skillforge.backend.exception.ResourceNotFoundException;
import com.skillforge.backend.repository.CourseRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CourseService {

	@Autowired
    private final CourseRepository courseRepository;
    private final CategoryService categoryService;
    private final CurrentUserService currentUserService;
    private final MappingService mappingService;

   

    @Transactional(readOnly = true)
    public List<CourseResponse> findApproved(String search) {
        List<Course> courses =
            search == null || search.isBlank()
                ? courseRepository.findByStatusOrderByCreatedAtDesc(
                    CourseStatus.APPROVED
                )
                : courseRepository
                    .findByStatusAndTitleContainingIgnoreCaseOrderByCreatedAtDesc(
                        CourseStatus.APPROVED,
                        search.trim()
                    );

        return courses.stream()
            .map(mappingService::toCourseResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public CourseResponse findApprovedById(Long courseId) {
        Course course = findEntity(courseId);

        if (course.getStatus() != CourseStatus.APPROVED) {
            throw new ResourceNotFoundException(
                "Approved course not found"
            );
        }

        return mappingService.toCourseResponse(course);
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> findInstructorCourses() {
        User instructor = currentUserService.getCurrentUser();

        return courseRepository
            .findByInstructorIdOrderByCreatedAtDesc(
                instructor.getId()
            )
            .stream()
            .map(mappingService::toCourseResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> findPendingCourses() {
        return courseRepository
            .findByStatusOrderByCreatedAtDesc(
                CourseStatus.PENDING_APPROVAL
            )
            .stream()
            .map(mappingService::toCourseResponse)
            .toList();
    }

    @Transactional
    public CourseResponse create(CourseRequest request) {
        User instructor = currentUserService.getCurrentUser();
        Category category =
            categoryService.findEntity(request.categoryId());

        Course course = new Course();
        copyRequest(course, request, category);
        course.setInstructor(instructor);
        course.setStatus(CourseStatus.DRAFT);

        return mappingService.toCourseResponse(
            courseRepository.save(course)
        );
    }

    @Transactional
    public CourseResponse update(
        Long courseId,
        CourseRequest request
    ) {
        Course course = findOwnedCourse(courseId);

        if (
            course.getStatus() == CourseStatus.APPROVED
            || course.getStatus() == CourseStatus.PENDING_APPROVAL
        ) {
            throw new BadRequestException(
                "Only draft or rejected courses can be edited"
            );
        }

        Category category =
            categoryService.findEntity(request.categoryId());

        copyRequest(course, request, category);
        course.setStatus(CourseStatus.DRAFT);

        return mappingService.toCourseResponse(
            courseRepository.save(course)
        );
    }

    @Transactional
    public CourseResponse submit(Long courseId) {
        Course course = findOwnedCourse(courseId);

        if (course.getStatus() != CourseStatus.DRAFT
            && course.getStatus() != CourseStatus.REJECTED) {
            throw new BadRequestException(
                "Only draft or rejected courses can be submitted"
            );
        }

        course.setStatus(CourseStatus.PENDING_APPROVAL);

        return mappingService.toCourseResponse(
            courseRepository.save(course)
        );
    }

    @Transactional
    public CourseResponse updateStatus(
        Long courseId,
        CourseStatus status
    ) {
        if (
            status != CourseStatus.APPROVED
            && status != CourseStatus.REJECTED
            && status != CourseStatus.DEACTIVATED
        ) {
            throw new BadRequestException(
                "Admin can approve, reject or deactivate a course"
            );
        }

        Course course = findEntity(courseId);
        course.setStatus(status);

        return mappingService.toCourseResponse(
            courseRepository.save(course)
        );
    }

   
    public Course findEntity(Long courseId) {
        return courseRepository
            .findById(courseId)
            .orElseThrow(() ->
                new ResourceNotFoundException("Course not found")
            );
    }

    public Course findOwnedCourse(Long courseId) {
        Course course = findEntity(courseId);
        User user = currentUserService.getCurrentUser();

        if (
            user.getRole() != Role.ADMIN
            && !course.getInstructor().getId().equals(user.getId())
        ) {
            throw new ForbiddenException(
                "You do not own this course"
            );
        }

        return course;
    }

    private void copyRequest(
        Course course,
        CourseRequest request,
        Category category
    ) {
        course.setTitle(request.title().trim());
        course.setDescription(request.description().trim());
        course.setPrice(request.price());
        course.setLevel(request.level());
        course.setThumbnailUrl(request.thumbnailUrl());
        course.setCategory(category);
    }
}
