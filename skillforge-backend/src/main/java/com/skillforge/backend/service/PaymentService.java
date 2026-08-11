package com.skillforge.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.skillforge.backend.dto.PaymentRequest;
import com.skillforge.backend.dto.PaymentResponse;
import com.skillforge.backend.entity.Course;
import com.skillforge.backend.entity.Payment;
import com.skillforge.backend.entity.User;
import com.skillforge.backend.enums.CourseStatus;
import com.skillforge.backend.enums.PaymentStatus;
import com.skillforge.backend.exception.BadRequestException;
import com.skillforge.backend.repository.PaymentRepository;

@Service
public class PaymentService {

	private final PaymentRepository paymentRepository;
	private final CourseService courseService;
	private final EnrollmentService enrollmentService;
	private final CurrentUserService currentUserService;
	private final MappingService mappingService;
	private final NotificationService notificationService;

	public PaymentService(PaymentRepository paymentRepository, CourseService courseService,
			EnrollmentService enrollmentService, CurrentUserService currentUserService, MappingService mappingService,
			NotificationService notificationService) {
		this.paymentRepository = paymentRepository;
		this.courseService = courseService;
		this.enrollmentService = enrollmentService;
		this.currentUserService = currentUserService;
		this.mappingService = mappingService;
		this.notificationService = notificationService;
	}

	@Transactional
	public PaymentResponse checkout(PaymentRequest request) {
		User student = currentUserService.getCurrentUser();
		Course course = courseService.findEntity(request.courseId());

		if (course.getStatus() != CourseStatus.APPROVED) {
			throw new BadRequestException("Only approved courses can be purchased");
		}

		enrollmentService.createEnrollment(student, course);

		Payment payment = new Payment();
		payment.setStudent(student);
		payment.setCourse(course);
		payment.setAmount(course.getPrice());
		payment.setStatus(PaymentStatus.SUCCESS);
		payment.setTransactionReference(
				"SF-" + UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase());
		payment.setPaidAt(LocalDateTime.now());

		paymentRepository.save(payment);
		notificationService.sendPaymentConfirmation(payment);

		return mappingService.toPaymentResponse(payment);
	}

	@Transactional(readOnly = true)
	public List<PaymentResponse> findMyPayments() {
		User student = currentUserService.getCurrentUser();

		return paymentRepository.findByStudentIdOrderByPaidAtDesc(student.getId()).stream()
				.map(mappingService::toPaymentResponse).toList();
	}

	@Transactional(readOnly = true)
	public List<PaymentResponse> findAll() {
		return paymentRepository.findAll().stream().map(mappingService::toPaymentResponse).toList();
	}
}
