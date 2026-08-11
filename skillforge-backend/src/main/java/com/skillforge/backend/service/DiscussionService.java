package com.skillforge.backend.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.skillforge.backend.dto.DiscussionReplyRequest;
import com.skillforge.backend.dto.DiscussionReplyResponse;
import com.skillforge.backend.dto.DiscussionRequest;
import com.skillforge.backend.dto.DiscussionResponse;
import com.skillforge.backend.entity.Course;
import com.skillforge.backend.entity.Discussion;
import com.skillforge.backend.entity.DiscussionReply;
import com.skillforge.backend.entity.User;
import com.skillforge.backend.enums.DiscussionStatus;
import com.skillforge.backend.enums.NotificationType;
import com.skillforge.backend.enums.Role;
import com.skillforge.backend.repository.DiscussionReplyRepository;
import com.skillforge.backend.repository.DiscussionRepository;

@Service
public class DiscussionService {

    private final DiscussionRepository discussionRepository;
    private final DiscussionReplyRepository replyRepository;
    private final CourseService courseService;
    private final EnrollmentService enrollmentService;
    private final CurrentUserService currentUserService;
    private final InAppNotificationService notificationService;

    public DiscussionService(
        DiscussionRepository discussionRepository,
        DiscussionReplyRepository replyRepository,
        CourseService courseService,
        EnrollmentService enrollmentService,
        CurrentUserService currentUserService,
        InAppNotificationService notificationService
    ) {
        this.discussionRepository = discussionRepository;
        this.replyRepository = replyRepository;
        this.courseService = courseService;
        this.enrollmentService = enrollmentService;
        this.currentUserService = currentUserService;
        this.notificationService = notificationService;
    }

    @Transactional
    public DiscussionResponse createDiscussion(
        DiscussionRequest request
    ) {
        User student = currentUserService.getCurrentUser();

        if (student.getRole() != Role.STUDENT) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Only students can create discussions"
            );
        }

        Course course =
            courseService.findEntity(request.courseId());

        boolean enrolled =
            enrollmentService.isEnrolled(
                student.getId(),
                course.getId()
            );

        if (!enrolled) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "You must be enrolled in this course"
            );
        }

        Discussion discussion = new Discussion();
        discussion.setCourse(course);
        discussion.setStudent(student);
        discussion.setTitle(request.title());
        discussion.setMessage(request.message());
        discussion.setStatus(DiscussionStatus.OPEN);

        Discussion saved =
            discussionRepository.save(discussion);

        notificationService.notifyUser(
            course.getInstructor(),
            "New course discussion",
            student.getFirstName()
                + " "
                + student.getLastName()
                + " asked a question in "
                + course.getTitle(),
            NotificationType.ANNOUNCEMENT,
            saved.getId(),
            "DISCUSSION",
            "/instructor/discussions"
        );

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<DiscussionResponse> getCourseDiscussions(
        Long courseId
    ) {
        User currentUser =
            currentUserService.getCurrentUser();

        Course course =
            courseService.findEntity(courseId);

        boolean allowed = false;

        if (currentUser.getRole() == Role.ADMIN) {
            allowed = true;
        }

        if (
            currentUser.getRole() == Role.INSTRUCTOR
            && course.getInstructor()
                .getId()
                .equals(currentUser.getId())
        ) {
            allowed = true;
        }

        if (
            currentUser.getRole() == Role.STUDENT
            && enrollmentService.isEnrolled(
                currentUser.getId(),
                courseId
            )
        ) {
            allowed = true;
        }

        if (!allowed) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "You cannot view discussions for this course"
            );
        }

        return discussionRepository
            .findByCourseIdOrderByCreatedAtDesc(
                courseId
            )
            .stream()
            .map(this::mapToResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public DiscussionResponse getDiscussion(
        Long discussionId
    ) {
        Discussion discussion =
            findDiscussion(discussionId);

        validateViewAccess(discussion);

        return mapToResponse(discussion);
    }

    @Transactional
    public DiscussionReplyResponse addReply(
        Long discussionId,
        DiscussionReplyRequest request
    ) {
        User currentUser =
            currentUserService.getCurrentUser();

        Discussion discussion =
            findDiscussion(discussionId);

        if (discussion.getStatus() == DiscussionStatus.CLOSED) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "This discussion is closed"
            );
        }

        boolean isStudentOwner =
            currentUser.getRole() == Role.STUDENT
            && discussion.getStudent()
                .getId()
                .equals(currentUser.getId());

        boolean isCourseInstructor =
            currentUser.getRole() == Role.INSTRUCTOR
            && discussion.getCourse()
                .getInstructor()
                .getId()
                .equals(currentUser.getId());

        if (!isStudentOwner && !isCourseInstructor) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "You cannot reply to this discussion"
            );
        }

        DiscussionReply reply =
            new DiscussionReply();

        reply.setDiscussion(discussion);
        reply.setAuthor(currentUser);
        reply.setMessage(request.message());

        DiscussionReply saved =
            replyRepository.save(reply);

        if (isCourseInstructor) {
            notificationService.notifyUser(
                discussion.getStudent(),
                "Instructor replied",
                "Your instructor replied to your discussion: "
                    + discussion.getTitle(),
                NotificationType.ANNOUNCEMENT,
                discussion.getId(),
                "DISCUSSION",
                "/student/discussions"
            );
        } else {
            notificationService.notifyUser(
                discussion.getCourse().getInstructor(),
                "Student replied",
                discussion.getStudent().getFirstName()
                    + " replied in discussion: "
                    + discussion.getTitle(),
                NotificationType.ANNOUNCEMENT,
                discussion.getId(),
                "DISCUSSION",
                "/instructor/discussions"
            );
        }

        return mapReply(saved);
    }

    @Transactional
    public DiscussionResponse resolveDiscussion(
        Long discussionId
    ) {
        User currentUser =
            currentUserService.getCurrentUser();

        Discussion discussion =
            findDiscussion(discussionId);

        boolean isStudentOwner =
            discussion.getStudent()
                .getId()
                .equals(currentUser.getId());

        boolean isInstructor =
            discussion.getCourse()
                .getInstructor()
                .getId()
                .equals(currentUser.getId());

        if (!isStudentOwner && !isInstructor) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "You cannot resolve this discussion"
            );
        }

        discussion.setStatus(
            DiscussionStatus.RESOLVED
        );

        return mapToResponse(discussion);
    }

    @Transactional
    public DiscussionResponse closeDiscussion(
        Long discussionId
    ) {
        User currentUser =
            currentUserService.getCurrentUser();

        Discussion discussion =
            findDiscussion(discussionId);

        boolean isInstructor =
            discussion.getCourse()
                .getInstructor()
                .getId()
                .equals(currentUser.getId());

        boolean isAdmin =
            currentUser.getRole() == Role.ADMIN;

        if (!isInstructor && !isAdmin) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Only the instructor or admin can close it"
            );
        }

        discussion.setStatus(
            DiscussionStatus.CLOSED
        );

        return mapToResponse(discussion);
    }

    @Transactional
    public void deleteDiscussion(
        Long discussionId
    ) {
        User currentUser =
            currentUserService.getCurrentUser();

        Discussion discussion =
            findDiscussion(discussionId);

        boolean isStudentOwner =
            discussion.getStudent()
                .getId()
                .equals(currentUser.getId());

        boolean isInstructor =
            discussion.getCourse()
                .getInstructor()
                .getId()
                .equals(currentUser.getId());

        boolean isAdmin =
            currentUser.getRole() == Role.ADMIN;

        if (
            !isStudentOwner
            && !isInstructor
            && !isAdmin
        ) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "You cannot delete this discussion"
            );
        }

        discussionRepository.delete(discussion);
    }

    private Discussion findDiscussion(
        Long discussionId
    ) {
        return discussionRepository
            .findById(discussionId)
            .orElseThrow(
                () -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Discussion not found"
                )
            );
    }

    private void validateViewAccess(
        Discussion discussion
    ) {
        User currentUser =
            currentUserService.getCurrentUser();

        boolean allowed =
            currentUser.getRole() == Role.ADMIN;

        if (
            currentUser.getRole() == Role.INSTRUCTOR
            && discussion.getCourse()
                .getInstructor()
                .getId()
                .equals(currentUser.getId())
        ) {
            allowed = true;
        }

        if (
            currentUser.getRole() == Role.STUDENT
            && enrollmentService.isEnrolled(
                currentUser.getId(),
                discussion.getCourse().getId()
            )
        ) {
            allowed = true;
        }

        if (!allowed) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "You cannot view this discussion"
            );
        }
    }

    private DiscussionResponse mapToResponse(
        Discussion discussion
    ) {
        List<DiscussionReplyResponse> replies =
            replyRepository
                .findByDiscussionIdOrderByCreatedAtAsc(
                    discussion.getId()
                )
                .stream()
                .map(this::mapReply)
                .toList();

        return new DiscussionResponse(
            discussion.getId(),
            discussion.getCourse().getId(),
            discussion.getCourse().getTitle(),
            discussion.getStudent().getId(),
            discussion.getStudent().getFirstName()
                + " "
                + discussion.getStudent().getLastName(),
            discussion.getTitle(),
            discussion.getMessage(),
            discussion.getStatus(),
            discussion.getCreatedAt(),
            discussion.getUpdatedAt(),
            replies
        );
    }

    private DiscussionReplyResponse mapReply(
        DiscussionReply reply
    ) {
        User author = reply.getAuthor();

        return new DiscussionReplyResponse(
            reply.getId(),
            author.getId(),
            author.getFirstName()
                + " "
                + author.getLastName(),
            author.getRole().name(),
            reply.getMessage(),
            reply.getCreatedAt()
        );
    }
}