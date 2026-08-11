package com.skillforge.backend.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.skillforge.backend.entity.Payment;
import com.skillforge.backend.enums.PaymentStatus;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // --- Student Queries ---
    List<Payment> findByStudentIdOrderByPaidAtDesc(Long studentId);

    // --- Instructor Queries ---
    List<Payment> findByCourseInstructorIdAndStatus(Long instructorId, PaymentStatus status);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.course.instructor.id = :instructorId AND p.status = :status")
    BigDecimal sumAmountByCourseInstructorIdAndStatus(@Param("instructorId") Long instructorId, @Param("status") PaymentStatus status);

    // --- Admin Queries ---
    List<Payment> findByStatusOrderByPaidAtDesc(PaymentStatus status);

    long countByStatus(PaymentStatus status);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = :status")
    BigDecimal sumAmountByStatus(@Param("status") PaymentStatus status);

    // --- Utility Queries ---
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);
}