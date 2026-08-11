package com.skillforge.backend.service;

import java.math.BigDecimal;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.skillforge.backend.entity.Category;
import com.skillforge.backend.entity.Course;
import com.skillforge.backend.entity.CourseModule;
import com.skillforge.backend.entity.Lesson;
import com.skillforge.backend.entity.Question;
import com.skillforge.backend.entity.Quiz;
import com.skillforge.backend.entity.QuizOption;
import com.skillforge.backend.entity.User;
import com.skillforge.backend.enums.CourseLevel;
import com.skillforge.backend.enums.CourseStatus;
import com.skillforge.backend.enums.Role;
import com.skillforge.backend.enums.UserStatus;
import com.skillforge.backend.repository.CategoryRepository;
import com.skillforge.backend.repository.CourseModuleRepository;
import com.skillforge.backend.repository.CourseRepository;
import com.skillforge.backend.repository.LessonRepository;
import com.skillforge.backend.repository.QuestionRepository;
import com.skillforge.backend.repository.QuizOptionRepository;
import com.skillforge.backend.repository.QuizRepository;
import com.skillforge.backend.repository.UserRepository;

@Service
public class DemoDataService {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final CourseRepository courseRepository;
    private final CourseModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuizOptionRepository optionRepository;
    private final PasswordEncoder passwordEncoder;

    public DemoDataService(
        UserRepository userRepository,
        CategoryRepository categoryRepository,
        CourseRepository courseRepository,
        CourseModuleRepository moduleRepository,
        LessonRepository lessonRepository,
        QuizRepository quizRepository,
        QuestionRepository questionRepository,
        QuizOptionRepository optionRepository,
        PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.courseRepository = courseRepository;
        this.moduleRepository = moduleRepository;
        this.lessonRepository = lessonRepository;
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.optionRepository = optionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void seed(
        String adminEmail,
        String adminPassword,
        boolean seedDemoData
    ) {
        ensureUser(
            "SkillForge",
            "Admin",
            adminEmail,
            adminPassword,
            Role.ADMIN,
            UserStatus.ACTIVE
        );

        if (!seedDemoData) {
            return;
        }

        User instructor = ensureUser(
            "Demo",
            "Instructor",
            "instructor@skillforge.local",
            "Instructor@123",
            Role.INSTRUCTOR,
            UserStatus.ACTIVE
        );

        ensureUser(
            "Demo",
            "Student",
            "student@skillforge.local",
            "Student@123",
            Role.STUDENT,
            UserStatus.ACTIVE
        );

        Category category = categoryRepository
            .findByNameIgnoreCase("Java Development")
            .orElseGet(() -> {
                Category created = new Category();
                created.setName("Java Development");
                created.setDescription(
                    "Java, Spring and backend development courses"
                );
                return categoryRepository.save(created);
            });

        if (courseRepository.count() > 0) {
            return;
        }

        Course course = new Course();
        course.setTitle("Spring Boot Fundamentals");
        course.setDescription(
            "Learn REST APIs, dependency injection, JPA and Spring Security through a practical project."
        );
        course.setPrice(new BigDecimal("499.00"));
        course.setLevel(CourseLevel.BEGINNER);
        course.setStatus(CourseStatus.APPROVED);
        course.setThumbnailUrl(
            "/course-placeholder.svg"
        );
        course.setCategory(category);
        course.setInstructor(instructor);
        courseRepository.save(course);

        CourseModule module = new CourseModule();
        module.setCourse(course);
        module.setTitle("Getting Started with Spring Boot");
        module.setPosition(1);
        moduleRepository.save(module);

        Lesson lessonOne = new Lesson();
        lessonOne.setModule(module);
        lessonOne.setTitle("Introduction to Spring Boot");
        lessonOne.setContent(
            "Spring Boot simplifies Spring application configuration and provides sensible defaults."
        );
        lessonOne.setVideoUrl(
            "https://www.youtube.com/embed/vtPkZShrvXQ"
        );
        lessonOne.setPosition(1);
        lessonRepository.save(lessonOne);

        Lesson lessonTwo = new Lesson();
        lessonTwo.setModule(module);
        lessonTwo.setTitle("Dependency Injection");
        lessonTwo.setContent(
            "Dependency injection supplies an object's dependencies from the Spring container."
        );
        lessonTwo.setVideoUrl(
            "https://www.youtube.com/embed/IKD2-MAkXyQ"
        );
        lessonTwo.setPosition(2);
        lessonRepository.save(lessonTwo);

        Quiz quiz = new Quiz();
        quiz.setModule(module);
        quiz.setTitle("Spring Boot Basics Quiz");
        quiz.setPassingMarks(1);
        quiz.setMaxAttempts(3);
        quiz.setPublished(true);
        quizRepository.save(quiz);

        Question question = new Question();
        question.setQuiz(quiz);
        question.setText(
            "Which annotation marks the main Spring Boot application class?"
        );
        question.setMarks(1);
        questionRepository.save(question);

        addOption(question, "@SpringBootApplication", true);
        addOption(question, "@Entity", false);
        addOption(question, "@Repository", false);
        addOption(question, "@BeanOnly", false);
    }

    private User ensureUser(
        String firstName,
        String lastName,
        String email,
        String password,
        Role role,
        UserStatus status
    ) {
        return userRepository
            .findByEmailIgnoreCase(email)
            .orElseGet(() -> {
                User user = new User();
                user.setFirstName(firstName);
                user.setLastName(lastName);
                user.setEmail(email.toLowerCase());
                user.setPassword(
                    passwordEncoder.encode(password)
                );
                user.setRole(role);
                user.setStatus(status);
                return userRepository.save(user);
            });
    }

    private void addOption(
        Question question,
        String text,
        boolean correct
    ) {
        QuizOption option = new QuizOption();
        option.setQuestion(question);
        option.setText(text);
        option.setCorrect(correct);
        optionRepository.save(option);
    }
}
