package com.skillforge.backend.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.skillforge.backend.enums.PaymentStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "payments")
public class Payment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 10)
    private String currency = "INR";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentStatus status;

    /*
     * Kept for compatibility with your current payment history.
     * After successful Razorpay verification, we will store the
     * Razorpay payment ID here as well.
     */
    @Column(unique = true, length = 100)
    private String transactionReference;

    @Column(
        name = "razorpay_order_id",
        unique = true,
        length = 100
    )
    private String razorpayOrderId;

    @Column(
        name = "razorpay_payment_id",
        unique = true,
        length = 100
    )
    private String razorpayPaymentId;

    @Column(
        name = "razorpay_signature",
        length = 500
    )
    private String razorpaySignature;

    @Column(
        name = "failure_reason",
        length = 500
    )
    private String failureReason;

    private LocalDateTime paidAt;
}