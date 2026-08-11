package com.skillforge.backend.service;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.skillforge.backend.entity.User;
import com.skillforge.backend.enums.CourseStatus;
import com.skillforge.backend.enums.PaymentStatus;
import com.skillforge.backend.enums.Role;
import com.skillforge.backend.enums.UserStatus;
import com.skillforge.backend.exception.ForbiddenException;
import com.skillforge.backend.repository.CertificateRepository;
import com.skillforge.backend.repository.CourseRepository;
import com.skillforge.backend.repository.EnrollmentRepository;
import com.skillforge.backend.repository.PaymentRepository;
import com.skillforge.backend.repository.UserRepository;

@Service
public class DashboardService {

    private final CurrentUserService currentUserService;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final PaymentRepository paymentRepository;
    private final CertificateRepository certificateRepository;

    public DashboardService(
        CurrentUserService currentUserService,
        UserRepository userRepository,
        CourseRepository courseRepository,
        EnrollmentRepository enrollmentRepository,
        PaymentRepository paymentRepository,
        CertificateRepository certificateRepository
    ) {
        this.currentUserService = currentUserService;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.paymentRepository = paymentRepository;
        this.certificateRepository = certificateRepository;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> currentDashboard() {
        User user = currentUserService.getCurrentUser();

        return switch (user.getRole()) {
            case ADMIN -> adminDashboard();
            case INSTRUCTOR -> instructorDashboard(user);
            case STUDENT -> studentDashboard(user);
        };
    }

    private Map<String, Object> adminDashboard() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("role", Role.ADMIN);
        result.put("totalUsers", userRepository.count());
        result.put(
            "pendingUsers",
            userRepository.countByStatus(UserStatus.PENDING)
        );
        result.put("totalCourses", courseRepository.count());
        result.put(
            "pendingCourses",
            courseRepository.countByStatus(
                CourseStatus.PENDING_APPROVAL
            )
        );
        result.put(
            "successfulPayments",
            paymentRepository.countByStatus(PaymentStatus.SUCCESS)
        );

        BigDecimal revenue = paymentRepository
            .findAll()
            .stream()
            .filter(payment ->
                payment.getStatus() == PaymentStatus.SUCCESS
            )
            .map(payment -> payment.getAmount())
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        result.put("revenue", revenue);
        return result;
    }

    private Map<String, Object> instructorDashboard(User user) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("role", Role.INSTRUCTOR);
        result.put(
            "courses",
            courseRepository.countByInstructorId(user.getId())
        );
        result.put(
            "enrollments",
            enrollmentRepository.countByCourseInstructorId(
                user.getId()
            )
        );
        return result;
    }

    private Map<String, Object> studentDashboard(User user) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("role", Role.STUDENT);
        result.put(
            "enrollments",
            enrollmentRepository.countByStudentId(user.getId())
        );
        result.put(
            "certificates",
            certificateRepository.countByStudentId(user.getId())
        );
        return result;
    }
}
