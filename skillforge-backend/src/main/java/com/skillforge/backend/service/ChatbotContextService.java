package com.skillforge.backend.service;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.skillforge.backend.dto.ChatbotContext;
import com.skillforge.backend.entity.Certificate;
import com.skillforge.backend.entity.Course;
import com.skillforge.backend.entity.Enrollment;
import com.skillforge.backend.entity.Payment;
import com.skillforge.backend.entity.User;
import com.skillforge.backend.enums.ChatIntent;
import com.skillforge.backend.enums.CourseStatus;
import com.skillforge.backend.enums.PaymentStatus;
import com.skillforge.backend.enums.Role;
import com.skillforge.backend.enums.UserStatus;
import com.skillforge.backend.repository.CertificateRepository;
import com.skillforge.backend.repository.CourseRepository;
import com.skillforge.backend.repository.EnrollmentRepository;
import com.skillforge.backend.repository.PaymentRepository;
import com.skillforge.backend.repository.UserRepository;

@Service
public class ChatbotContextService {

	private static final int MAX_COURSES_IN_CONTEXT = 25;
	private static final int MAX_USERS_IN_CONTEXT = 15;

	private final EnrollmentRepository enrollmentRepository;
	private final CertificateRepository certificateRepository;
	private final PaymentRepository paymentRepository;
	private final CourseRepository courseRepository;
	private final UserRepository userRepository;

	public ChatbotContextService(EnrollmentRepository enrollmentRepository, CertificateRepository certificateRepository,
			PaymentRepository paymentRepository, CourseRepository courseRepository, UserRepository userRepository) {
		this.enrollmentRepository = enrollmentRepository;
		this.certificateRepository = certificateRepository;
		this.paymentRepository = paymentRepository;
		this.courseRepository = courseRepository;
		this.userRepository = userRepository;
	}

	@Transactional(readOnly = true)
	public ChatbotContext getContext(ChatIntent intent, Long userId, Role role) {

		Map<String, Object> data = new LinkedHashMap<>();

		switch (intent) {

		// ================= STUDENT INTENTS =================
		case MY_ENROLLMENTS -> {
			if (userId == null) {
				data.put("message",
						"The visitor is not logged in, so their enrollments cannot be looked up. Suggest logging in first.");
			} else {
				List<Enrollment> enrollments = enrollmentRepository.findByStudentIdOrderByEnrolledAtDesc(userId);
				data.put("enrollments",
						enrollments.stream()
								.map(enrollment -> Map.of("course", enrollment.getCourse().getTitle(), "progress",
										enrollment.getProgressPercent(), "status", enrollment.getStatus().name()))
								.toList());
			}
		}

		case CERTIFICATE -> {
			if (userId == null) {
				data.put("message",
						"The visitor is not logged in, so their certificates cannot be looked up. Suggest logging in first.");
			} else {
				List<Certificate> certificates = certificateRepository.findByStudentIdOrderByIssuedAtDesc(userId);
				data.put("certificates", certificates.stream()
						.map(certificate -> Map.of("course", certificate.getCourse().getTitle(), "serialNumber",
								certificate.getSerialNumber(), "issuedAt", certificate.getIssuedAt().toString()))
						.toList());
			}
		}

		case PAYMENT_STATUS -> {
			if (userId == null) {
				data.put("message",
						"The visitor is not logged in, so their payment history cannot be looked up. Suggest logging in first.");
			} else {
				List<Payment> payments = paymentRepository.findByStudentIdOrderByPaidAtDesc(userId);
				data.put("payments", payments.stream().map(this::describePayment).toList());
			}
		}

		// ================= INSTRUCTOR INTENTS =================
		case INSTRUCTOR_MY_COURSES, INSTRUCTOR_COURSE_STATUS -> {
			if (userId == null || role != Role.INSTRUCTOR) {
				data.put("message", "This information is only available to logged-in instructors.");
			} else {
				List<Course> instructorCourses = courseRepository.findByInstructorIdOrderByCreatedAtDesc(userId);
				data.put("myCourses", instructorCourses.stream()
						.map(course -> Map.of("title", course.getTitle(), "status", course.getStatus().name(), "price",
								"₹" + course.getPrice(), "category",
								course.getCategory() != null ? course.getCategory().getName() : "General"))
						.toList());
			}
		}

		case INSTRUCTOR_STUDENTS_LIST -> {
			if (userId == null || role != Role.INSTRUCTOR) {
				data.put("message", "This information is only available to logged-in instructors.");
			} else {
				List<Enrollment> enrollments = enrollmentRepository
						.findByCourseInstructorIdOrderByEnrolledAtDesc(userId);
				data.put("enrolledStudents", enrollments.stream()
						.map(enrollment -> Map.of("studentName",
								enrollment.getStudent().getFirstName() + " " + enrollment.getStudent().getLastName(),
								"courseTitle", enrollment.getCourse().getTitle(), "progress",
								enrollment.getProgressPercent(), "enrolledAt", enrollment.getEnrolledAt().toString()))
						.toList());
			}
		}

		case INSTRUCTOR_EARNINGS -> {
			if (userId == null || role != Role.INSTRUCTOR) {
				data.put("message", "This information is only available to logged-in instructors.");
			} else {
				BigDecimal totalEarnings = paymentRepository.sumAmountByCourseInstructorIdAndStatus(userId,
						PaymentStatus.SUCCESS);
				List<Payment> successfulPayments = paymentRepository.findByCourseInstructorIdAndStatus(userId,
						PaymentStatus.SUCCESS);

				data.put("totalEarnings", "₹" + (totalEarnings != null ? totalEarnings : BigDecimal.ZERO));
				data.put("totalSalesCount", successfulPayments.size());
				data.put("salesDetails", successfulPayments.stream().map(this::describePayment).toList());
			}
		}

		// ================= PUBLIC / COURSE CATALOG INTENTS =================
		case COURSE_FEES, COURSE_SEARCH, COURSE_DETAILS, COURSE_DURATION -> {
			data.put("courses", buildCourseCatalog());
		}

		// ================= ADMIN INTENTS =================
		case ADMIN_USERS -> {
			if (role != Role.ADMIN) {
				data.put("message", "This information is only available to administrators.");
			} else {
				data.put("totalUsers", userRepository.count());
				data.put("studentCount", userRepository.countByRole(Role.STUDENT));
				data.put("instructorCount", userRepository.countByRole(Role.INSTRUCTOR));
				data.put("adminCount", userRepository.countByRole(Role.ADMIN));
				data.put("pendingAccountCount", userRepository.countByStatus(UserStatus.PENDING));

				// Fetch all users and format their name, email, role, and status
				List<User> allUsers = userRepository.findAllByOrderByCreatedAtDesc();
				data.put("userList", allUsers.stream().map(this::describeUser).toList());
			}
		}

		case ADMIN_PENDING_COURSES -> {
			if (role != Role.ADMIN) {
				data.put("message", "This information is only available to administrators.");
			} else {
				List<Course> pendingCourses = courseRepository
						.findByStatusOrderByCreatedAtDesc(CourseStatus.PENDING_APPROVAL);
				data.put("pendingCourseCount", pendingCourses.size());
				data.put("pendingCourses", pendingCourses.stream()
						.map(course -> Map.of("title", course.getTitle(), "instructor",
								course.getInstructor().getFirstName() + " " + course.getInstructor().getLastName(),
								"category", course.getCategory() != null ? course.getCategory().getName() : "General",
								"price", "₹" + course.getPrice()))
						.toList());
			}
		}

		case ADMIN_INSTRUCTOR_APPROVALS -> {
			if (role != Role.ADMIN) {
				data.put("message", "This information is only available to administrators.");
			} else {
				List<User> pendingInstructors = userRepository.findByRoleAndStatusOrderByCreatedAtDesc(Role.INSTRUCTOR,
						UserStatus.PENDING);
				data.put("pendingInstructorCount", pendingInstructors.size());
				data.put("pendingInstructors", pendingInstructors.stream().map(this::describeUser).toList());
			}
		}

		case ADMIN_REVENUE -> {
			if (role != Role.ADMIN) {
				data.put("message", "This information is only available to administrators.");
			} else {
				BigDecimal totalRevenue = paymentRepository.sumAmountByStatus(PaymentStatus.SUCCESS);
				List<Payment> successfulPayments = paymentRepository
						.findByStatusOrderByPaidAtDesc(PaymentStatus.SUCCESS);

				data.put("totalRevenue", "₹" + (totalRevenue != null ? totalRevenue : BigDecimal.ZERO));
				data.put("successfulPaymentCount", successfulPayments.size());
				data.put("failedPaymentCount", paymentRepository.countByStatus(PaymentStatus.FAILED));
				data.put("refundedPaymentCount", paymentRepository.countByStatus(PaymentStatus.REFUNDED));
				data.put("recentPayments",
						successfulPayments.stream().limit(MAX_USERS_IN_CONTEXT).map(this::describePayment).toList());
			}
		}

		case ADMIN_DASHBOARD -> {
			if (role != Role.ADMIN) {
				data.put("message", "This information is only available to administrators.");
			} else {
				data.put("totalUsers", userRepository.count());
				data.put("totalCourses", courseRepository.count());
				data.put("approvedCourseCount", courseRepository.countByStatus(CourseStatus.APPROVED));
				data.put("pendingCourseCount", courseRepository.countByStatus(CourseStatus.PENDING_APPROVAL));
				data.put("pendingInstructorCount", userRepository
						.findByRoleAndStatusOrderByCreatedAtDesc(Role.INSTRUCTOR, UserStatus.PENDING).size());

				BigDecimal totalRevenue = paymentRepository.sumAmountByStatus(PaymentStatus.SUCCESS);
				data.put("totalRevenue", "₹" + (totalRevenue != null ? totalRevenue : BigDecimal.ZERO));
			}
		}

		// ================= GENERAL / FALLBACK =================
		default -> {
			data.put("courses", buildCourseCatalog());
		}
		}

		ChatbotContext context = new ChatbotContext();
		context.setData(data);

		return context;
	}

	private List<Map<String, Object>> buildCourseCatalog() {
		List<Course> courses = courseRepository.findByStatusOrderByCreatedAtDesc(CourseStatus.APPROVED);

		return courses.stream().limit(MAX_COURSES_IN_CONTEXT).map(course -> {
			int moduleCount = course.getModules() != null ? course.getModules().size() : 0;
			int lessonCount = course.getModules() != null ? course.getModules().stream()
					.mapToInt(module -> module.getLessons() != null ? module.getLessons().size() : 0).sum() : 0;

			Map<String, Object> courseInfo = new LinkedHashMap<>();
			courseInfo.put("title", course.getTitle());
			courseInfo.put("price", "₹" + course.getPrice());
			courseInfo.put("level", course.getLevel() != null ? course.getLevel().name() : "ALL");
			courseInfo.put("category", course.getCategory() != null ? course.getCategory().getName() : "General");
			courseInfo.put("moduleCount", moduleCount);
			courseInfo.put("lessonCount", lessonCount);

			return courseInfo;
		}).toList();
	}

	private Map<String, Object> describeUser(User user) {
		Map<String, Object> info = new LinkedHashMap<>();
		info.put("name", user.getFirstName() + " " + user.getLastName());
		info.put("email", user.getEmail());
		info.put("role", user.getRole().name());
		info.put("status", user.getStatus().name());
		info.put("registeredAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : "N/A");
		return info;
	}

	private Map<String, Object> describePayment(Payment payment) {
		Map<String, Object> paymentInfo = new LinkedHashMap<>();
		paymentInfo.put("course", payment.getCourse() != null ? payment.getCourse().getTitle() : "N/A");
		paymentInfo.put("student",
				payment.getStudent() != null
						? payment.getStudent().getFirstName() + " " + payment.getStudent().getLastName()
						: "N/A");
		paymentInfo.put("amount", "₹" + payment.getAmount());
		paymentInfo.put("currency", payment.getCurrency() != null ? payment.getCurrency() : "INR");
		paymentInfo.put("status", payment.getStatus().name());
		paymentInfo.put("paidAt", payment.getPaidAt() != null ? payment.getPaidAt().toString() : "Not completed");
		return paymentInfo;
	}
}