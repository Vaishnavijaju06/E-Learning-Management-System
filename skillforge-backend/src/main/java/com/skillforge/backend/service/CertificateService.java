package com.skillforge.backend.service;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import javax.imageio.ImageIO;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.skillforge.backend.dto.CertificateResponse;
import com.skillforge.backend.entity.Certificate;
import com.skillforge.backend.entity.Course;
import com.skillforge.backend.entity.Enrollment;
import com.skillforge.backend.entity.Quiz;
import com.skillforge.backend.entity.User;
import com.skillforge.backend.enums.Role;
import com.skillforge.backend.exception.BadRequestException;
import com.skillforge.backend.exception.ForbiddenException;
import com.skillforge.backend.exception.ResourceNotFoundException;
import com.skillforge.backend.repository.CertificateRepository;
import com.skillforge.backend.repository.EnrollmentRepository;
import com.skillforge.backend.repository.QuizAttemptRepository;
import com.skillforge.backend.repository.QuizRepository;

@Service
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final QuizRepository quizRepository;
    private final QuizAttemptRepository attemptRepository;
    private final CourseService courseService;
    private final CurrentUserService currentUserService;
    private final MappingService mappingService;
    private final NotificationService notificationService;
    private final String frontendUrl;

    public CertificateService(
        CertificateRepository certificateRepository,
        EnrollmentRepository enrollmentRepository,
        QuizRepository quizRepository,
        QuizAttemptRepository attemptRepository,
        CourseService courseService,
        CurrentUserService currentUserService,
        MappingService mappingService,
        NotificationService notificationService,
        @Value("${app.frontend-url}") String frontendUrl
    ) {
        this.certificateRepository = certificateRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.quizRepository = quizRepository;
        this.attemptRepository = attemptRepository;
        this.courseService = courseService;
        this.currentUserService = currentUserService;
        this.mappingService = mappingService;
        this.notificationService = notificationService;
        this.frontendUrl = frontendUrl;
    }

    @Transactional
    public CertificateResponse issue(Long courseId) {
        User student = currentUserService.getCurrentUser();
        Course course = courseService.findEntity(courseId);

        Certificate existing = certificateRepository
            .findByStudentIdAndCourseId(student.getId(), courseId)
            .orElse(null);

        if (existing != null) {
            return mappingService.toCertificateResponse(existing);
        }

        Enrollment enrollment = enrollmentRepository
            .findByStudentIdAndCourseId(student.getId(), courseId)
            .orElseThrow(() ->
                new BadRequestException(
                    "You are not enrolled in this course"
                )
            );

        if (enrollment.getProgressPercent() < 100) {
            throw new BadRequestException(
                "Complete all lessons before requesting a certificate"
            );
        }

        List<Quiz> quizzes =
            quizRepository.findByModuleCourseIdAndPublishedTrue(
                courseId
            );

        boolean allQuizzesPassed = quizzes.stream()
            .allMatch(quiz ->
                attemptRepository
                    .existsByQuizIdAndStudentIdAndPassedTrue(
                        quiz.getId(),
                        student.getId()
                    )
            );

        if (!allQuizzesPassed) {
            throw new BadRequestException(
                "Pass every published quiz before requesting a certificate"
            );
        }

        Certificate certificate = new Certificate();
        certificate.setSerialNumber(
            "SFC-"
                + UUID.randomUUID()
                    .toString()
                    .replace("-", "")
                    .substring(0, 16)
                    .toUpperCase()
        );
        certificate.setStudent(student);
        certificate.setCourse(course);
        certificate.setIssuedAt(LocalDateTime.now());

        Certificate savedCertificate =
        	    certificateRepository.save(certificate);

        	notificationService.sendCertificateGenerated(
        	    savedCertificate
        	);

        return mappingService.toCertificateResponse(certificate);
    }

    @Transactional(readOnly = true)
    public List<CertificateResponse> findMine() {
        User student = currentUserService.getCurrentUser();

        return certificateRepository
            .findByStudentIdOrderByIssuedAtDesc(student.getId())
            .stream()
            .map(mappingService::toCertificateResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public CertificateResponse verify(String serialNumber) {
        return mappingService.toCertificateResponse(
            findBySerial(serialNumber)
        );
    }

    @Transactional(readOnly = true)
    public byte[] download(String serialNumber) {
        Certificate certificate = findBySerial(serialNumber);
        User currentUser = currentUserService.getCurrentUser();

        if (
            currentUser.getRole() != Role.ADMIN
            && !certificate
                .getStudent()
                .getId()
                .equals(currentUser.getId())
        ) {
            throw new ForbiddenException(
                "You cannot download this certificate"
            );
        }

        try {
            return createPdf(certificate);
        } catch (Exception exception) {
            throw new IllegalStateException(
                "Could not generate certificate PDF",
                exception
            );
        }
    }

    private Certificate findBySerial(String serialNumber) {
        return certificateRepository
            .findBySerialNumber(serialNumber)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Certificate not found"
                )
            );
    }

    private byte[] createPdf(Certificate certificate)
        throws Exception {
        try (
            PDDocument document = new PDDocument();
            ByteArrayOutputStream output =
                new ByteArrayOutputStream()
        ) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            PDFont titleFont = new PDType1Font(
                Standard14Fonts.FontName.HELVETICA_BOLD
            );

            PDFont normalFont = new PDType1Font(
                Standard14Fonts.FontName.HELVETICA
            );

            try (
                PDPageContentStream content =
                    new PDPageContentStream(document, page)
            ) {
                float width = page.getMediaBox().getWidth();

                content.setLineWidth(4);
                content.addRect(
                    35,
                    35,
                    width - 70,
                    page.getMediaBox().getHeight() - 70
                );
                content.stroke();

                drawCentered(
                    content,
                    titleFont,
                    28,
                    "SKILLFORGE",
                    width,
                    735
                );

                drawCentered(
                    content,
                    titleFont,
                    24,
                    "Certificate of Completion",
                    width,
                    680
                );

                drawCentered(
                    content,
                    normalFont,
                    15,
                    "This certificate is proudly presented to",
                    width,
                    625
                );

                String studentName =
                    certificate.getStudent().getFirstName()
                        + " "
                        + certificate.getStudent().getLastName();

                drawCentered(
                    content,
                    titleFont,
                    25,
                    studentName,
                    width,
                    575
                );

                drawCentered(
                    content,
                    normalFont,
                    15,
                    "for successfully completing",
                    width,
                    530
                );

                drawCentered(
                    content,
                    titleFont,
                    20,
                    certificate.getCourse().getTitle(),
                    width,
                    485
                );

                drawCentered(
                    content,
                    normalFont,
                    12,
                    "Certificate number: "
                        + certificate.getSerialNumber(),
                    width,
                    420
                );

                drawCentered(
                    content,
                    normalFont,
                    12,
                    "Issued on: "
                        + certificate.getIssuedAt().toLocalDate(),
                    width,
                    395
                );

                String verificationUrl =
                    frontendUrl
                        + "/verify-certificate/"
                        + certificate.getSerialNumber();

                BitMatrix matrix = new QRCodeWriter().encode(
                    verificationUrl,
                    BarcodeFormat.QR_CODE,
                    150,
                    150
                );

                BufferedImage image =
                    MatrixToImageWriter.toBufferedImage(matrix);

                ByteArrayOutputStream imageOutput =
                    new ByteArrayOutputStream();

                ImageIO.write(image, "PNG", imageOutput);

                PDImageXObject qrImage =
                    PDImageXObject.createFromByteArray(
                        document,
                        imageOutput.toByteArray(),
                        "certificate-qr"
                    );

                content.drawImage(
                    qrImage,
                    (width - 120) / 2,
                    185,
                    120,
                    120
                );

                drawCentered(
                    content,
                    normalFont,
                    10,
                    "Scan to verify this certificate",
                    width,
                    165
                );
            }

            document.save(output);
            return output.toByteArray();
        }
    }

    private void drawCentered(
        PDPageContentStream content,
        PDFont font,
        float fontSize,
        String text,
        float pageWidth,
        float y
    ) throws Exception {
        float textWidth =
            font.getStringWidth(text) / 1000 * fontSize;

        content.beginText();
        content.setFont(font, fontSize);
        content.newLineAtOffset(
            (pageWidth - textWidth) / 2,
            y
        );
        content.showText(text);
        content.endText();
    }
}
