package com.skillforge.backend.dto;

public record RazorpayOrderResponse(

    Long paymentRecordId,

    String razorpayOrderId,

    String keyId,

    Long amount,

    String currency,

    Long courseId,

    String courseTitle,

    String studentName,

    String studentEmail

) {
}