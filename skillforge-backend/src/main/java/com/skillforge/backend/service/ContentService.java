package com.skillforge.backend.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import com.skillforge.backend.dto.LessonRequest;
import com.skillforge.backend.dto.LessonResponse;
import com.skillforge.backend.dto.ModuleRequest;
import com.skillforge.backend.dto.ModuleResponse;
import com.skillforge.backend.entity.Course;
import com.skillforge.backend.entity.CourseModule;
import com.skillforge.backend.entity.Lesson;
import com.skillforge.backend.exception.BadRequestException;
import com.skillforge.backend.exception.ResourceNotFoundException;
import com.skillforge.backend.repository.CourseModuleRepository;

import com.skillforge.backend.repository.LessonRepository;


import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContentService {

	@Autowired
    private final CourseService courseService;
    private final CourseModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;
    private final MappingService mappingService;

   
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
