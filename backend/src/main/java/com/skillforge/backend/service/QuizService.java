package com.skillforge.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.skillforge.backend.dto.QuizCreateRequest;
import com.skillforge.backend.dto.QuizResponse;
import com.skillforge.backend.dto.QuizResultResponse;
import com.skillforge.backend.dto.QuizSubmissionRequest;
import com.skillforge.backend.entity.CourseModule;
import com.skillforge.backend.entity.Question;
import com.skillforge.backend.entity.Quiz;
import com.skillforge.backend.entity.QuizAttempt;
import com.skillforge.backend.entity.QuizOption;
import com.skillforge.backend.entity.User;
import com.skillforge.backend.exception.BadRequestException;
import com.skillforge.backend.exception.ForbiddenException;
import com.skillforge.backend.exception.ResourceNotFoundException;
import com.skillforge.backend.repository.EnrollmentRepository;
import com.skillforge.backend.repository.QuestionRepository;
import com.skillforge.backend.repository.QuizAttemptRepository;
import com.skillforge.backend.repository.QuizOptionRepository;
import com.skillforge.backend.repository.QuizRepository;

@Service
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuizOptionRepository optionRepository;
    private final QuizAttemptRepository attemptRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final ContentService contentService;
    private final CourseService courseService;
    private final CurrentUserService currentUserService;

    public QuizService(
        QuizRepository quizRepository,
        QuestionRepository questionRepository,
        QuizOptionRepository optionRepository,
        QuizAttemptRepository attemptRepository,
        EnrollmentRepository enrollmentRepository,
        ContentService contentService,
        CourseService courseService,
        CurrentUserService currentUserService
    ) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.optionRepository = optionRepository;
        this.attemptRepository = attemptRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.contentService = contentService;
        this.courseService = courseService;
        this.currentUserService = currentUserService;
    }

    @Transactional
    public QuizResponse create(
        Long moduleId,
        QuizCreateRequest request
    ) {
        CourseModule module = contentService.findModule(moduleId);
        courseService.findOwnedCourse(module.getCourse().getId());

        if (quizRepository.findByModuleId(moduleId).isPresent()) {
            throw new BadRequestException(
                "This module already has a quiz"
            );
        }

        int totalMarks = request.questions()
            .stream()
            .mapToInt(QuizCreateRequest.QuestionInput::marks)
            .sum();

        if (request.passingMarks() > totalMarks) {
            throw new BadRequestException(
                "Passing marks cannot exceed total marks"
            );
        }

        for (
            QuizCreateRequest.QuestionInput question
            : request.questions()
        ) {
            long correctOptions = question.options()
                .stream()
                .filter(QuizCreateRequest.OptionInput::correct)
                .count();

            if (correctOptions != 1) {
                throw new BadRequestException(
                    "Every MCQ must contain exactly one correct option"
                );
            }
        }

        Quiz quiz = new Quiz();
        quiz.setModule(module);
        quiz.setTitle(request.title().trim());
        quiz.setPassingMarks(request.passingMarks());
        quiz.setMaxAttempts(request.maxAttempts());
        quiz.setPublished(request.published());
        quizRepository.save(quiz);

        for (
            QuizCreateRequest.QuestionInput questionInput
            : request.questions()
        ) {
            Question question = new Question();
            question.setQuiz(quiz);
            question.setText(questionInput.text().trim());
            question.setMarks(questionInput.marks());
            questionRepository.save(question);

            for (
                QuizCreateRequest.OptionInput optionInput
                : questionInput.options()
            ) {
                QuizOption option = new QuizOption();
                option.setQuestion(question);
                option.setText(optionInput.text().trim());
                option.setCorrect(optionInput.correct());
                optionRepository.save(option);
            }
        }

        return buildResponse(quiz, true, 0);
    }

    @Transactional(readOnly = true)
    public QuizResponse getInstructorQuiz(Long moduleId) {
        CourseModule module = contentService.findModule(moduleId);
        courseService.findOwnedCourse(module.getCourse().getId());

        Quiz quiz = quizRepository
            .findByModuleId(moduleId)
            .orElseThrow(() ->
                new ResourceNotFoundException("Quiz not found")
            );

        return buildResponse(quiz, true, 0);
    }

    @Transactional(readOnly = true)
    public QuizResponse getStudentQuiz(Long moduleId) {
        User student = currentUserService.getCurrentUser();
        CourseModule module = contentService.findModule(moduleId);

        if (
            !enrollmentRepository.existsByStudentIdAndCourseId(
                student.getId(),
                module.getCourse().getId()
            )
        ) {
            throw new ForbiddenException(
                "You are not enrolled in this course"
            );
        }

        Quiz quiz = quizRepository
            .findByModuleId(moduleId)
            .filter(Quiz::isPublished)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Published quiz not found"
                )
            );

        long attemptsUsed = attemptRepository
            .countByQuizIdAndStudentId(
                quiz.getId(),
                student.getId()
            );

        return buildResponse(quiz, false, attemptsUsed);
    }

    @Transactional
    public QuizResultResponse submit(
        Long quizId,
        QuizSubmissionRequest request
    ) {
        User student = currentUserService.getCurrentUser();
        Quiz quiz = findQuiz(quizId);

        if (!quiz.isPublished()) {
            throw new BadRequestException("Quiz is not published");
        }

        Long courseId = quiz.getModule().getCourse().getId();

        if (
            !enrollmentRepository.existsByStudentIdAndCourseId(
                student.getId(),
                courseId
            )
        ) {
            throw new ForbiddenException(
                "You are not enrolled in this course"
            );
        }

        long previousAttempts = attemptRepository
            .countByQuizIdAndStudentId(quizId, student.getId());

        if (previousAttempts >= quiz.getMaxAttempts()) {
            throw new BadRequestException(
                "Maximum quiz attempts have been used"
            );
        }

        List<Question> questions =
            questionRepository.findByQuizIdOrderByIdAsc(quizId);

        int score = 0;
        int totalMarks = 0;

        for (Question question : questions) {
            totalMarks += question.getMarks();
            Long selectedOptionId =
                request.answers().get(question.getId());

            if (selectedOptionId == null) {
                continue;
            }

            QuizOption option = optionRepository
                .findByIdAndQuestionId(
                    selectedOptionId,
                    question.getId()
                )
                .orElseThrow(() ->
                    new BadRequestException(
                        "An answer contains an invalid option"
                    )
                );

            if (option.isCorrect()) {
                score += question.getMarks();
            }
        }

        int attemptNumber = Math.toIntExact(previousAttempts + 1);
        boolean passed = score >= quiz.getPassingMarks();

        QuizAttempt attempt = new QuizAttempt();
        attempt.setQuiz(quiz);
        attempt.setStudent(student);
        attempt.setScore(score);
        attempt.setPassed(passed);
        attempt.setAttemptNumber(attemptNumber);
        attempt.setAttemptedAt(LocalDateTime.now());
        attemptRepository.save(attempt);

        return new QuizResultResponse(
            attempt.getId(),
            score,
            totalMarks,
            quiz.getPassingMarks(),
            passed,
            attemptNumber,
            quiz.getMaxAttempts() - attemptNumber
        );
    }

    public Quiz findQuiz(Long quizId) {
        return quizRepository
            .findById(quizId)
            .orElseThrow(() ->
                new ResourceNotFoundException("Quiz not found")
            );
    }

    private QuizResponse buildResponse(
        Quiz quiz,
        boolean showAnswers,
        long attemptsUsed
    ) {
        List<QuizResponse.QuestionView> questions =
            questionRepository
                .findByQuizIdOrderByIdAsc(quiz.getId())
                .stream()
                .map(question -> {
                    List<QuizResponse.OptionView> options =
                        optionRepository
                            .findByQuestionIdOrderByIdAsc(
                                question.getId()
                            )
                            .stream()
                            .map(option ->
                                new QuizResponse.OptionView(
                                    option.getId(),
                                    option.getText(),
                                    showAnswers
                                        ? option.isCorrect()
                                        : null
                                )
                            )
                            .toList();

                    return new QuizResponse.QuestionView(
                        question.getId(),
                        question.getText(),
                        question.getMarks(),
                        options
                    );
                })
                .toList();

        return new QuizResponse(
            quiz.getId(),
            quiz.getModule().getId(),
            quiz.getTitle(),
            quiz.getPassingMarks(),
            quiz.getMaxAttempts(),
            attemptsUsed,
            quiz.isPublished(),
            questions
        );
    }
}
