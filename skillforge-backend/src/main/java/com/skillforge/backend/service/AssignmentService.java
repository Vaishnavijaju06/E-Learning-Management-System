package com.skillforge.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.skillforge.backend.dto.AssignmentEvaluationRequest;
import com.skillforge.backend.dto.AssignmentResponse;
import com.skillforge.backend.dto.AssignmentSubmissionResponse;
import com.skillforge.backend.entity.Assignment;
import com.skillforge.backend.entity.AssignmentSubmission;
import com.skillforge.backend.entity.Course;
import com.skillforge.backend.entity.User;
import com.skillforge.backend.enums.AssignmentStatus;
import com.skillforge.backend.enums.NotificationType;
import com.skillforge.backend.enums.Role;
import com.skillforge.backend.enums.SubmissionStatus;
import com.skillforge.backend.exception.BadRequestException;
import com.skillforge.backend.repository.AssignmentRepository;
import com.skillforge.backend.repository.AssignmentSubmissionRepository;
import com.skillforge.backend.repository.EnrollmentRepository;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final AssignmentSubmissionRepository submissionRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CourseService courseService;
    private final CurrentUserService currentUserService;
    private final EnrollmentService enrollmentService;
    private final FileStorageService fileStorageService;
    private final InAppNotificationService notificationService;

    public AssignmentService(
        AssignmentRepository assignmentRepository,
        AssignmentSubmissionRepository submissionRepository,
        EnrollmentRepository enrollmentRepository,
        CourseService courseService,
        CurrentUserService currentUserService,
        EnrollmentService enrollmentService,
        FileStorageService fileStorageService,
        InAppNotificationService notificationService
    ) {
        this.assignmentRepository =
            assignmentRepository;
        this.submissionRepository =
            submissionRepository;
        this.enrollmentRepository =
            enrollmentRepository;
        this.courseService = courseService;
        this.currentUserService =
            currentUserService;
        this.enrollmentService =
            enrollmentService;
        this.fileStorageService =
            fileStorageService;
        this.notificationService =
            notificationService;
    }

    @Transactional
    public AssignmentResponse createAssignment(
        Long courseId,
        String title,
        String description,
        Integer maximumMarks,
        LocalDateTime dueDate,
        MultipartFile file
    ) {
        User instructor =
            currentUserService.getCurrentUser();

        if (instructor.getRole() != Role.INSTRUCTOR) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Only instructors can create assignments"
            );
        }

        Course course =
            courseService.findEntity(courseId);

        validateInstructorOwnership(
            course,
            instructor
        );

        if (
            maximumMarks == null
            || maximumMarks <= 0
        ) {
            throw new BadRequestException(
                "Maximum marks must be greater than zero"
            );
        }

        if (
            dueDate == null
            || !dueDate.isAfter(LocalDateTime.now())
        ) {
            throw new BadRequestException(
                "Due date must be in the future"
            );
        }

        Assignment assignment =
            new Assignment();

        assignment.setCourse(course);
        assignment.setInstructor(instructor);
        assignment.setTitle(title);
        assignment.setDescription(description);
        assignment.setMaximumMarks(maximumMarks);
        assignment.setDueDate(dueDate);
        assignment.setStatus(
            AssignmentStatus.DRAFT
        );

        if (file != null && !file.isEmpty()) {
            assignment.setAttachmentPath(
                fileStorageService
                    .storeAssignmentFile(file)
            );

            assignment.setOriginalFileName(
                file.getOriginalFilename()
            );
        }

        return mapAssignment(
            assignmentRepository.save(assignment)
        );
    }

    @Transactional
    public AssignmentResponse publishAssignment(
        Long assignmentId
    ) {
        User instructor =
            currentUserService.getCurrentUser();

        Assignment assignment =
            findAssignment(assignmentId);

        validateInstructorOwnership(
            assignment.getCourse(),
            instructor
        );

        assignment.setStatus(
            AssignmentStatus.PUBLISHED
        );

        Assignment saved =
            assignmentRepository.save(assignment);

        enrollmentRepository
            .findByCourseId(
                assignment.getCourse().getId()
            )
            .forEach(enrollment ->
                notificationService.notifyUser(
                    enrollment.getStudent(),
                    "New assignment published",
                    assignment.getTitle()
                        + " has been published for "
                        + assignment
                            .getCourse()
                            .getTitle(),
                    NotificationType
                        .ASSIGNMENT_PUBLISHED,
                    assignment.getId(),
                    "ASSIGNMENT",
                    "/student/assignments"
                )
            );

        return mapAssignment(saved);
    }

    @Transactional
    public AssignmentResponse closeAssignment(
        Long assignmentId
    ) {
        User instructor =
            currentUserService.getCurrentUser();

        Assignment assignment =
            findAssignment(assignmentId);

        validateInstructorOwnership(
            assignment.getCourse(),
            instructor
        );

        assignment.setStatus(
            AssignmentStatus.CLOSED
        );

        return mapAssignment(
            assignmentRepository.save(assignment)
        );
    }

    @Transactional(readOnly = true)
    public List<AssignmentResponse>
        getInstructorAssignments() {

        User instructor =
            currentUserService.getCurrentUser();

        return assignmentRepository
            .findByInstructorIdOrderByCreatedAtDesc(
                instructor.getId()
            )
            .stream()
            .map(this::mapAssignment)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<AssignmentResponse>
        getStudentAssignments() {

        User student =
            currentUserService.getCurrentUser();

        return assignmentRepository
            .findPublishedForStudent(student.getId())
            .stream()
            .map(this::mapAssignment)
            .toList();
    }

    @Transactional
    public AssignmentSubmissionResponse submitAssignment(
        Long assignmentId,
        String comment,
        MultipartFile file
    ) {
        User student =
            currentUserService.getCurrentUser();

        Assignment assignment =
            findAssignment(assignmentId);

        if (
            assignment.getStatus()
                != AssignmentStatus.PUBLISHED
        ) {
            throw new BadRequestException(
                "Assignment is not available for submission"
            );
        }

        if (
            !enrollmentService.isEnrolled(
                student.getId(),
                assignment.getCourse().getId()
            )
        ) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "You are not enrolled in this course"
            );
        }

        String filePath =
            fileStorageService
                .storeSubmissionFile(file);

        AssignmentSubmission submission =
            submissionRepository
                .findByAssignmentIdAndStudentId(
                    assignmentId,
                    student.getId()
                )
                .orElseGet(
                    AssignmentSubmission::new
                );

        submission.setAssignment(assignment);
        submission.setStudent(student);
        submission.setFilePath(filePath);
        submission.setOriginalFileName(
            file.getOriginalFilename()
        );
        submission.setComment(comment);
        submission.setSubmittedAt(
            LocalDateTime.now()
        );
        submission.setMarksObtained(null);
        submission.setFeedback(null);
        submission.setEvaluatedAt(null);

        boolean late =
            LocalDateTime.now()
                .isAfter(assignment.getDueDate());

        submission.setStatus(
            late
                ? SubmissionStatus.LATE
                : SubmissionStatus.SUBMITTED
        );

        AssignmentSubmission saved =
            submissionRepository.save(submission);

        notificationService.notifyUser(
            assignment.getInstructor(),
            "Assignment submitted",
            student.getFirstName()
                + " "
                + student.getLastName()
                + " submitted "
                + assignment.getTitle(),
            NotificationType.ASSIGNMENT_SUBMITTED,
            saved.getId(),
            "ASSIGNMENT_SUBMISSION",
            "/instructor/assignments"
        );

        return mapSubmission(saved);
    }

    @Transactional(readOnly = true)
    public List<AssignmentSubmissionResponse>
        getAssignmentSubmissions(
            Long assignmentId
        ) {

        User instructor =
            currentUserService.getCurrentUser();

        Assignment assignment =
            findAssignment(assignmentId);

        validateInstructorOwnership(
            assignment.getCourse(),
            instructor
        );

        return submissionRepository
            .findByAssignmentIdOrderBySubmittedAtDesc(
                assignmentId
            )
            .stream()
            .map(this::mapSubmission)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<AssignmentSubmissionResponse>
        getMySubmissions() {

        User student =
            currentUserService.getCurrentUser();

        return submissionRepository
            .findByStudentIdOrderBySubmittedAtDesc(
                student.getId()
            )
            .stream()
            .map(this::mapSubmission)
            .toList();
    }

    @Transactional
    public AssignmentSubmissionResponse evaluate(
        Long submissionId,
        AssignmentEvaluationRequest request
    ) {
        User instructor =
            currentUserService.getCurrentUser();

        AssignmentSubmission submission =
            submissionRepository
                .findById(submissionId)
                .orElseThrow(
                    () ->
                        new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Submission not found"
                        )
                );

        validateInstructorOwnership(
            submission
                .getAssignment()
                .getCourse(),
            instructor
        );

        if (
            request.marksObtained()
                > submission
                    .getAssignment()
                    .getMaximumMarks()
        ) {
            throw new BadRequestException(
                "Marks cannot exceed maximum marks"
            );
        }

        submission.setMarksObtained(
            request.marksObtained()
        );

        submission.setFeedback(
            request.feedback()
        );

        submission.setStatus(
            SubmissionStatus.EVALUATED
        );

        submission.setEvaluatedAt(
            LocalDateTime.now()
        );

        AssignmentSubmission saved =
            submissionRepository.save(submission);

        notificationService.notifyUser(
            submission.getStudent(),
            "Assignment evaluated",
            submission
                .getAssignment()
                .getTitle()
                + " has been evaluated. Marks: "
                + request.marksObtained()
                + "/"
                + submission
                    .getAssignment()
                    .getMaximumMarks(),
            NotificationType.ASSIGNMENT_EVALUATED,
            saved.getId(),
            "ASSIGNMENT_SUBMISSION",
            "/student/assignments"
        );

        return mapSubmission(saved);
    }

    @Transactional(readOnly = true)
    public Resource getAssignmentFile(
        Long assignmentId
    ) {
        Assignment assignment =
            findAssignment(assignmentId);

        return fileStorageService.load(
            assignment.getAttachmentPath()
        );
    }

    @Transactional(readOnly = true)
    public Resource getSubmissionFile(
        Long submissionId
    ) {
        User currentUser =
            currentUserService.getCurrentUser();

        AssignmentSubmission submission =
            submissionRepository
                .findById(submissionId)
                .orElseThrow(
                    () ->
                        new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Submission not found"
                        )
                );

        boolean studentOwner =
            submission
                .getStudent()
                .getId()
                .equals(currentUser.getId());

        boolean instructorOwner =
            submission
                .getAssignment()
                .getInstructor()
                .getId()
                .equals(currentUser.getId());

        if (!studentOwner && !instructorOwner) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "You cannot download this submission"
            );
        }

        return fileStorageService.load(
            submission.getFilePath()
        );
    }

    @Transactional
    public void deleteAssignment(
        Long assignmentId
    ) {
        User instructor =
            currentUserService.getCurrentUser();

        Assignment assignment =
            findAssignment(assignmentId);

        validateInstructorOwnership(
            assignment.getCourse(),
            instructor
        );

        assignmentRepository.delete(assignment);
    }

    private Assignment findAssignment(
        Long assignmentId
    ) {
        return assignmentRepository
            .findById(assignmentId)
            .orElseThrow(
                () -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Assignment not found"
                )
            );
    }

    private void validateInstructorOwnership(
        Course course,
        User instructor
    ) {
        if (
            !course.getInstructor()
                .getId()
                .equals(instructor.getId())
        ) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "You do not own this course"
            );
        }
    }

    private AssignmentResponse mapAssignment(
        Assignment assignment
    ) {
        User instructor =
            assignment.getInstructor();

        return new AssignmentResponse(
            assignment.getId(),
            assignment.getCourse().getId(),
            assignment.getCourse().getTitle(),
            instructor.getId(),
            instructor.getFirstName()
                + " "
                + instructor.getLastName(),
            assignment.getTitle(),
            assignment.getDescription(),
            assignment.getOriginalFileName(),
            assignment.getMaximumMarks(),
            assignment.getDueDate(),
            assignment.getStatus(),
            assignment.getCreatedAt()
        );
    }

    private AssignmentSubmissionResponse mapSubmission(
        AssignmentSubmission submission
    ) {
        User student = submission.getStudent();
        Assignment assignment =
            submission.getAssignment();

        return new AssignmentSubmissionResponse(
            submission.getId(),
            assignment.getId(),
            assignment.getTitle(),
            student.getId(),
            student.getFirstName()
                + " "
                + student.getLastName(),
            student.getEmail(),
            submission.getOriginalFileName(),
            submission.getComment(),
            submission.getSubmittedAt(),
            submission.getStatus(),
            submission.getMarksObtained(),
            assignment.getMaximumMarks(),
            submission.getFeedback(),
            submission.getEvaluatedAt()
        );
    }
}