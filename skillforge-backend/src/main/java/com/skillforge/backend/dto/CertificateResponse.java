package com.skillforge.backend.dto;

import java.time.LocalDateTime;

public record CertificateResponse(
    Long id,
    String serialNumber,
    Long studentId,
    String studentName,
    Long courseId,
    String courseTitle,
    LocalDateTime issuedAt,
    String downloadUrl,
    String verificationUrl
) {
}
