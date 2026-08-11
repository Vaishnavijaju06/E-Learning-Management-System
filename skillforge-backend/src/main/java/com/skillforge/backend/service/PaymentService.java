package com.skillforge.backend.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.razorpay.Order;
import com.skillforge.backend.dto.PaymentRequest;
import com.skillforge.backend.dto.PaymentResponse;
import com.skillforge.backend.dto.RazorpayOrderResponse;
import com.skillforge.backend.entity.Course;
import com.skillforge.backend.entity.Payment;
import com.skillforge.backend.entity.User;
import com.skillforge.backend.enums.CourseStatus;
import com.skillforge.backend.enums.PaymentStatus;
import com.skillforge.backend.exception.BadRequestException;
import com.skillforge.backend.repository.PaymentRepository;

import com.skillforge.backend.dto.RazorpayVerificationRequest;
import com.skillforge.backend.dto.NotificationResponse;
import com.skillforge.backend.enums.NotificationType;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final CourseService courseService;
    private final EnrollmentService enrollmentService;
    private final CurrentUserService currentUserService;
    private final MappingService mappingService;
    private final NotificationService notificationService;
    private final RazorpayService razorpayService;
    private final InAppNotificationService
    inAppNotificationService;

    public PaymentService(
        PaymentRepository paymentRepository,
        CourseService courseService,
        EnrollmentService enrollmentService,
        CurrentUserService currentUserService,
        MappingService mappingService,
        NotificationService notificationService,
        RazorpayService razorpayService,
        InAppNotificationService inAppNotificationService
    ) {
        this.paymentRepository = paymentRepository;
        this.courseService = courseService;
        this.enrollmentService = enrollmentService;
        this.currentUserService = currentUserService;
        this.mappingService = mappingService;
        this.notificationService = notificationService;
        this.razorpayService = razorpayService;
        this.inAppNotificationService =
        	    inAppNotificationService;
    }

    /*
     * Creates a Razorpay order.
     *
     * Enrollment is NOT created at this stage.
     * It will be created only after signature verification.
     */
    @Transactional
    public RazorpayOrderResponse createRazorpayOrder(
        Long courseId
    ) {
        User student = currentUserService.getCurrentUser();
        Course course = courseService.findEntity(courseId);

        if (course.getStatus() != CourseStatus.APPROVED) {
            throw new BadRequestException(
                "Only approved courses can be purchased"
            );
        }

        if (
            enrollmentService.isEnrolled(
                student.getId(),
                course.getId()
            )
        ) {
            throw new BadRequestException(
                "You are already enrolled in this course"
            );
        }

        if (
            course.getPrice() == null
            || course.getPrice()
                .compareTo(BigDecimal.ZERO) <= 0
        ) {
            throw new BadRequestException(
                "This course does not require Razorpay payment"
            );
        }

        long amountInPaise = course
            .getPrice()
            .multiply(BigDecimal.valueOf(100))
            .setScale(0, RoundingMode.HALF_UP)
            .longValueExact();

        String receipt =
            "sf_"
                + UUID.randomUUID()
                    .toString()
                    .replace("-", "")
                    .substring(0, 20);

        Order razorpayOrder =
            razorpayService.createOrder(
                amountInPaise,
                receipt,
                student.getId(),
                course.getId()
            );

        String razorpayOrderId =
            razorpayOrder.get("id");

        Payment payment = new Payment();
        payment.setStudent(student);
        payment.setCourse(course);
        payment.setAmount(course.getPrice());
        payment.setCurrency(
            razorpayService.getCurrency()
        );
        payment.setStatus(PaymentStatus.CREATED);
        payment.setTransactionReference(receipt);
        payment.setRazorpayOrderId(
            razorpayOrderId
        );
        payment.setPaidAt(null);

        Payment savedPayment =
            paymentRepository.save(payment);

        String studentName =
            student.getFirstName()
                + " "
                + student.getLastName();

        return new RazorpayOrderResponse(
            savedPayment.getId(),
            razorpayOrderId,
            razorpayService.getKeyId(),
            amountInPaise,
            razorpayService.getCurrency(),
            course.getId(),
            course.getTitle(),
            studentName.trim(),
            student.getEmail()
        );
    }

    /*
     * Keep this temporarily so the old frontend still compiles.
     * We will remove this mock checkout after React Razorpay
     * Checkout is working.
     */
    @Transactional
    public PaymentResponse checkout(
        PaymentRequest request
    ) {
        User student = currentUserService.getCurrentUser();
        Course course =
            courseService.findEntity(request.courseId());

        if (course.getStatus() != CourseStatus.APPROVED) {
            throw new BadRequestException(
                "Only approved courses can be purchased"
            );
        }

        enrollmentService.createEnrollment(
            student,
            course
        );

        Payment payment = new Payment();
        payment.setStudent(student);
        payment.setCourse(course);
        payment.setAmount(course.getPrice());
        payment.setCurrency("INR");
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setTransactionReference(
            "SF-"
                + UUID.randomUUID()
                    .toString()
                    .replace("-", "")
                    .substring(0, 16)
                    .toUpperCase()
        );
        payment.setPaidAt(LocalDateTime.now());

        paymentRepository.save(payment);

        notificationService
            .sendPaymentConfirmation(payment);

        return mappingService
            .toPaymentResponse(payment);
    }
    
    @Transactional
    public PaymentResponse verifyRazorpayPayment(
        RazorpayVerificationRequest request
    ) {
        User currentStudent =
            currentUserService.getCurrentUser();

        Payment payment = paymentRepository
            .findByRazorpayOrderId(
                request.razorpayOrderId()
            )
            .orElseThrow(
                () -> new BadRequestException(
                    "Payment order was not found"
                )
            );

        if (
            !payment.getStudent()
                .getId()
                .equals(currentStudent.getId())
        ) {
            throw new BadRequestException(
                "This payment does not belong to the current student"
            );
        }

        /*
         * Makes the endpoint safe if React accidentally sends
         * the verification request more than once.
         */
        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            return mappingService.toPaymentResponse(payment);
        }

        /*
         * Use the order ID stored in our database.
         * Do not trust only the browser callback values.
         */
        boolean signatureValid =
            razorpayService.verifyPaymentSignature(
                payment.getRazorpayOrderId(),
                request.razorpayPaymentId(),
                request.razorpaySignature()
            );

        if (!signatureValid) {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailureReason(
                "Invalid Razorpay payment signature"
            );

            paymentRepository.save(payment);

            inAppNotificationService.notifyUser(
                currentStudent,
                "Payment verification failed",
                "We could not verify your payment for "
                    + payment.getCourse().getTitle()
                    + ".",
                NotificationType.PAYMENT_FAILED,
                payment.getId(),
                "PAYMENT",
                "/courses/"
                    + payment.getCourse().getId()
            );

            throw new BadRequestException(
                "Invalid Razorpay payment signature"
            );
        }

        payment.setRazorpayPaymentId(
            request.razorpayPaymentId()
        );

        payment.setRazorpaySignature(
            request.razorpaySignature()
        );

        payment.setTransactionReference(
            request.razorpayPaymentId()
        );

        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setFailureReason(null);
        payment.setPaidAt(LocalDateTime.now());

        Payment savedPayment =
            paymentRepository.save(payment);

        enrollmentService.createEnrollment(
            currentStudent,
            payment.getCourse()
        );

        notificationService.sendPaymentConfirmation(
            savedPayment
        );

        inAppNotificationService.notifyUser(
            currentStudent,
            "Payment successful",
            "Your payment for "
                + payment.getCourse().getTitle()
                + " was successful. The course is now available in My Learning.",
            NotificationType.PAYMENT_SUCCESS,
            savedPayment.getId(),
            "PAYMENT",
            "/student/learning"
        );

        return mappingService.toPaymentResponse(
            savedPayment
        );
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> findMyPayments() {
        User student =
            currentUserService.getCurrentUser();

        return paymentRepository
            .findByStudentIdOrderByPaidAtDesc(
                student.getId()
            )
            .stream()
            .map(mappingService::toPaymentResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> findAll() {
        return paymentRepository
            .findAll()
            .stream()
            .map(mappingService::toPaymentResponse)
            .toList();
    }
}