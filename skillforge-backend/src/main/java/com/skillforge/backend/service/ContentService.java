package com.skillforge.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.skillforge.backend.dto.CourseContentResponse;
import com.skillforge.backend.dto.LessonRequest;
import com.skillforge.backend.dto.LessonResponse;
import com.skillforge.backend.dto.ModuleRequest;
import com.skillforge.backend.dto.ModuleResponse;
import com.skillforge.backend.dto.ProgressResponse;
import com.skillforge.backend.entity.Course;
import com.skillforge.backend.entity.CourseModule;
import com.skillforge.backend.entity.Enrollment;
import com.skillforge.backend.entity.Lesson;
import com.skillforge.backend.entity.LessonProgress;
import com.skillforge.backend.entity.User;
import com.skillforge.backend.enums.EnrollmentStatus;
import com.skillforge.backend.enums.Role;
import com.skillforge.backend.exception.BadRequestException;
import com.skillforge.backend.exception.ForbiddenException;
import com.skillforge.backend.exception.ResourceNotFoundException;
import com.skillforge.backend.repository.CourseModuleRepository;
import com.skillforge.backend.repository.EnrollmentRepository;
import com.skillforge.backend.repository.LessonProgressRepository;
import com.skillforge.backend.repository.LessonRepository;
import com.skillforge.backend.repository.QuizRepository;

@Service
public class ContentService {

    private final CourseService courseService;
    private final CourseModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LessonProgressRepository progressRepository;
    private final QuizRepository quizRepository;
    private final CurrentUserService currentUserService;
    private final MappingService mappingService;

    public ContentService(
        CourseService courseService,
        CourseModuleRepository moduleRepository,
        LessonRepository lessonRepository,
        EnrollmentRepository enrollmentRepository,
        LessonProgressRepository progressRepository,
        QuizRepository quizRepository,
        CurrentUserService currentUserService,
        MappingService mappingService
    ) {
        this.courseService = courseService;
        this.moduleRepository = moduleRepository;
        this.lessonRepository = lessonRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.progressRepository = progressRepository;
        this.quizRepository = quizRepository;
        this.currentUserService = currentUserService;
        this.mappingService = mappingService;
    }

    @Transactional
    public ModuleResponse createModule(
        Long courseId,
        ModuleRequest request
    ) {
        Course course = courseService.findOwnedCourse(courseId);

        CourseModule module = new CourseModule();
        module.setCourse(course);
        module.setTitle(request.title().trim());
        module.setPosition(request.position());

        return mappingService.toModuleResponse(
            moduleRepository.save(module)
        );
    }

    @Transactional
    public LessonResponse createLesson(
        Long moduleId,
        LessonRequest request
    ) {
        CourseModule module = findModule(moduleId);
        courseService.findOwnedCourse(module.getCourse().getId());

        Lesson lesson = new Lesson();
        lesson.setModule(module);
        copyLessonRequest(lesson, request);

        lessonRepository.save(lesson);
        return toLessonResponse(lesson, false);
    }

    @Transactional
    public LessonResponse updateLesson(
        Long lessonId,
        LessonRequest request
    ) {
        Lesson lesson = findLesson(lessonId);
        courseService.findOwnedCourse(
            lesson.getModule().getCourse().getId()
        );

        copyLessonRequest(lesson, request);
        lessonRepository.save(lesson);

        return toLessonResponse(lesson, false);
    }

    @Transactional
    public void deleteLesson(Long lessonId) {
        Lesson lesson = findLesson(lessonId);
        courseService.findOwnedCourse(
            lesson.getModule().getCourse().getId()
        );
        lessonRepository.delete(lesson);
    }

    @Transactional(readOnly = true)
    public CourseContentResponse getCourseContent(Long courseId) {
        User user = currentUserService.getCurrentUser();
        Course course = courseService.findEntity(courseId);

        Enrollment enrollment = null;

        if (user.getRole() == Role.STUDENT) {
            enrollment = enrollmentRepository
                .findByStudentIdAndCourseId(user.getId(), courseId)
                .orElseThrow(() ->
                    new ForbiddenException(
                        "Purchase or enroll in this course first"
                    )
                );
        } else if (
            user.getRole() == Role.INSTRUCTOR
            && !course.getInstructor().getId().equals(user.getId())
        ) {
            throw new ForbiddenException(
                "You do not own this course"
            );
        }

        final Enrollment finalEnrollment = enrollment;

        Set<Long> completedLessonIds = finalEnrollment == null
            ? Set.of()
            : progressRepository
                .findByEnrollmentId(finalEnrollment.getId())
                .stream()
                .filter(LessonProgress::isCompleted)
                .map(progress -> progress.getLesson().getId())
                .collect(Collectors.toSet());

        List<CourseContentResponse.ModuleContent> modules =
            moduleRepository
                .findByCourseIdOrderByPositionAsc(courseId)
                .stream()
                .map(module -> {
                    List<LessonResponse> lessons = lessonRepository
                        .findByModuleIdOrderByPositionAsc(module.getId())
                        .stream()
                        .map(lesson ->
                            toLessonResponse(
                                lesson,
                                completedLessonIds.contains(
                                    lesson.getId()
                                )
                            )
                        )
                        .toList();

                    Long quizId = quizRepository
                        .findByModuleId(module.getId())
                        .map(quiz -> quiz.getId())
                        .orElse(null);

                    return new CourseContentResponse.ModuleContent(
                        module.getId(),
                        module.getTitle(),
                        module.getPosition(),
                        lessons,
                        quizId
                    );
                })
                .toList();

        int progress = finalEnrollment == null
            ? 0
            : finalEnrollment.getProgressPercent();

        return new CourseContentResponse(
            mappingService.toCourseResponse(course),
            progress,
            modules
        );
    }

    @Transactional
    public ProgressResponse markLessonCompleted(Long lessonId) {
        User student = currentUserService.getCurrentUser();
        Lesson lesson = findLesson(lessonId);
        Long courseId = lesson.getModule().getCourse().getId();

        Enrollment enrollment = enrollmentRepository
            .findByStudentIdAndCourseId(student.getId(), courseId)
            .orElseThrow(() ->
                new ForbiddenException(
                    "You are not enrolled in this course"
                )
            );

        LessonProgress progress = progressRepository
            .findByEnrollmentIdAndLessonId(
                enrollment.getId(),
                lessonId
            )
            .orElseGet(LessonProgress::new);

        progress.setEnrollment(enrollment);
        progress.setLesson(lesson);
        progress.setCompleted(true);
        progress.setCompletedAt(LocalDateTime.now());
        progressRepository.save(progress);

        long totalLessons =
            lessonRepository.countByModuleCourseId(courseId);

        long completedLessons =
            progressRepository.countByEnrollmentIdAndCompletedTrue(
                enrollment.getId()
            );

        int percentage = totalLessons == 0
            ? 0
            : (int) Math.round(
                completedLessons * 100.0 / totalLessons
            );

        enrollment.setProgressPercent(percentage);

        if (percentage == 100) {
            enrollment.setStatus(EnrollmentStatus.COMPLETED);
        }

        enrollmentRepository.save(enrollment);

        return new ProgressResponse(
            enrollment.getId(),
            lessonId,
            true,
            percentage
        );
    }

    public CourseModule findModule(Long moduleId) {
        return moduleRepository
            .findById(moduleId)
            .orElseThrow(() ->
                new ResourceNotFoundException("Module not found")
            );
    }

    public Lesson findLesson(Long lessonId) {
        return lessonRepository
            .findById(lessonId)
            .orElseThrow(() ->
                new ResourceNotFoundException("Lesson not found")
            );
    }

    private void copyLessonRequest(
        Lesson lesson,
        LessonRequest request
    ) {
        if (
            (request.content() == null || request.content().isBlank())
            && (request.videoUrl() == null
                || request.videoUrl().isBlank())
        ) {
            throw new BadRequestException(
                "Add lesson text or a video URL"
            );
        }

        lesson.setTitle(request.title().trim());
        lesson.setContent(request.content());
        lesson.setVideoUrl(request.videoUrl());
        lesson.setPosition(request.position());
    }

    private LessonResponse toLessonResponse(
        Lesson lesson,
        boolean completed
    ) {
        return new LessonResponse(
            lesson.getId(),
            lesson.getModule().getId(),
            lesson.getTitle(),
            lesson.getContent(),
            lesson.getVideoUrl(),
            lesson.getPosition(),
            completed
        );
    }
}
