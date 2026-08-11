package com.skillforge.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.skillforge.backend.enums.PaymentStatus;

public record PaymentResponse(
    Long id,
    Long courseId,
    String courseTitle,
    BigDecimal amount,
    PaymentStatus status,
    String transactionReference,
    LocalDateTime paidAt
) {
}
