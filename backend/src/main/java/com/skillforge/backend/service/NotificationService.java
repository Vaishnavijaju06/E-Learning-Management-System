package com.skillforge.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.skillforge.backend.client.EmailClient;
import com.skillforge.backend.dto.EmailRequest;
import com.skillforge.backend.entity.AssignmentSubmission;
import com.skillforge.backend.entity.Certificate;
import com.skillforge.backend.entity.Course;
import com.skillforge.backend.entity.Payment;
import com.skillforge.backend.entity.User;

@Service
public class NotificationService {

    private static final Logger logger =
        LoggerFactory.getLogger(
            NotificationService.class
        );

    private final EmailClient emailClient;
    private final String frontendUrl;

    public NotificationService(
        EmailClient emailClient,
        @Value("${app.frontend-url}") String frontendUrl
    ) {
        this.emailClient = emailClient;
        this.frontendUrl = frontendUrl;
    }

    public void sendWelcome(User user) {
        String subject =
            "Welcome to SkillForge";

        String body = """
            <!DOCTYPE html>
            <html>
            <body style="margin:0;background:#f4f6f9;font-family:Arial,sans-serif;padding:30px;">
              <div style="max-width:620px;margin:auto;background:#ffffff;border-radius:12px;padding:32px;">
                <h2 style="color:#0d6efd;margin-top:0;">Welcome to SkillForge</h2>

                <p>Hello <strong>%s</strong>,</p>

                <p>Your SkillForge account has been created successfully.</p>

                <p>
                  Registered email:
                  <strong>%s</strong>
                </p>

                <div style="margin:28px 0;">
                  <a href="http://localhost:5173/login"
                     style="background:#0d6efd;color:#ffffff;padding:12px 20px;text-decoration:none;border-radius:6px;">
                    Login to SkillForge
                  </a>
                </div>

                <p>Happy learning!</p>

                <p>
                  Regards,<br>
                  <strong>SkillForge Team</strong>
                </p>
              </div>
            </body>
            </html>
            """.formatted(
                safeName(user),
                user.getEmail()
            );

        sendSafely(
            user.getEmail(),
            subject,
            body,
            "welcome"
        );
    }

    public void sendPaymentConfirmation(
        Payment payment
    ) {
        User student = payment.getStudent();
        Course course = payment.getCourse();

        String paymentId =
            payment.getRazorpayPaymentId() != null
                ? payment.getRazorpayPaymentId()
                : payment.getTransactionReference();

        String subject =
            "Payment Successful - SkillForge";

        String body = """
            <!DOCTYPE html>
            <html>
            <body style="margin:0;background:#f4f6f9;font-family:Arial,sans-serif;padding:30px;">
              <div style="max-width:650px;margin:auto;background:#ffffff;border-radius:12px;padding:32px;">
                <h2 style="color:#198754;margin-top:0;">Payment Successful</h2>

                <p>Hello <strong>%s</strong>,</p>

                <p>Your payment has been verified successfully.</p>

                <table style="width:100%%;border-collapse:collapse;margin:20px 0;">
                  <tr>
                    <td style="padding:10px;border-bottom:1px solid #dddddd;">
                      <strong>Course</strong>
                    </td>
                    <td style="padding:10px;border-bottom:1px solid #dddddd;">
                      %s
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:10px;border-bottom:1px solid #dddddd;">
                      <strong>Amount</strong>
                    </td>
                    <td style="padding:10px;border-bottom:1px solid #dddddd;">
                      ₹%s
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:10px;border-bottom:1px solid #dddddd;">
                      <strong>Payment ID</strong>
                    </td>
                    <td style="padding:10px;border-bottom:1px solid #dddddd;">
                      %s
                    </td>
                  </tr>
                </table>

                <p>The course is now available in My Learning.</p>

                <div style="margin:28px 0;">
                  <a href="http://localhost:5173/student/learning"
                     style="background:#198754;color:#ffffff;padding:12px 20px;text-decoration:none;border-radius:6px;">
                    Open My Learning
                  </a>
                </div>

                <p>
                  Regards,<br>
                  <strong>SkillForge Team</strong>
                </p>
              </div>
            </body>
            </html>
            """.formatted(
                safeName(student),
                course.getTitle(),
                payment.getAmount(),
                paymentId
            );

        sendSafely(
            student.getEmail(),
            subject,
            body,
            "payment confirmation"
        );
    }

    public void sendCertificateGenerated(
        Certificate certificate
    ) {
        User student = certificate.getStudent();
        Course course = certificate.getCourse();

        /*
         * Change getSerialNumber() only if your entity uses
         * another getter such as getCertificateNumber().
         */
        String certificateNumber =
            certificate.getSerialNumber();

        String subject =
            "Certificate Generated - SkillForge";

        String body = """
            <!DOCTYPE html>
            <html>
            <body style="margin:0;background:#f4f6f9;font-family:Arial,sans-serif;padding:30px;">
              <div style="max-width:650px;margin:auto;background:#ffffff;border-radius:12px;padding:32px;">
                <h2 style="color:#0d6efd;margin-top:0;">Congratulations!</h2>

                <p>Hello <strong>%s</strong>,</p>

                <p>
                  You have successfully completed
                  <strong>%s</strong>.
                </p>

                <p>Your certificate is now available.</p>

                <table style="width:100%%;border-collapse:collapse;margin:20px 0;">
                  <tr>
                    <td style="padding:10px;border-bottom:1px solid #dddddd;">
                      <strong>Course</strong>
                    </td>
                    <td style="padding:10px;border-bottom:1px solid #dddddd;">
                      %s
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:10px;border-bottom:1px solid #dddddd;">
                      <strong>Certificate Number</strong>
                    </td>
                    <td style="padding:10px;border-bottom:1px solid #dddddd;">
                      %s
                    </td>
                  </tr>
                </table>

                <div style="margin:28px 0;">
                  <a href="http://localhost:5173/student/certificates"
                     style="background:#0d6efd;color:#ffffff;padding:12px 20px;text-decoration:none;border-radius:6px;">
                    View Certificate
                  </a>
                </div>

                <p>Keep learning and growing!</p>

                <p>
                  Regards,<br>
                  <strong>SkillForge Team</strong>
                </p>
              </div>
            </body>
            </html>
            """.formatted(
                safeName(student),
                course.getTitle(),
                course.getTitle(),
                certificateNumber
            );

        sendSafely(
            student.getEmail(),
            subject,
            body,
            "certificate"
        );
    }

    public void sendInstructorApproval(
        User instructor
    ) {
        String subject =
            "Instructor Account Approved - SkillForge";

        String body = """
            <!DOCTYPE html>
            <html>
            <body style="margin:0;background:#f4f6f9;font-family:Arial,sans-serif;padding:30px;">
              <div style="max-width:620px;margin:auto;background:#ffffff;border-radius:12px;padding:32px;">
                <h2 style="color:#198754;margin-top:0;">
                  Instructor Account Approved
                </h2>

                <p>Hello <strong>%s</strong>,</p>

                <p>
                  Your SkillForge instructor account has been approved by the administrator.
                </p>

                <p>
                  You can now log in, create courses, manage learning content,
                  publish assignments and interact with students.
                </p>

                <div style="margin:28px 0;">
                  <a href="http://localhost:5173/login"
                     style="background:#198754;color:#ffffff;padding:12px 20px;text-decoration:none;border-radius:6px;">
                    Login as Instructor
                  </a>
                </div>

                <p>
                  Regards,<br>
                  <strong>SkillForge Team</strong>
                </p>
              </div>
            </body>
            </html>
            """.formatted(
                safeName(instructor)
            );

        sendSafely(
            instructor.getEmail(),
            subject,
            body,
            "instructor approval"
        );
    }

    

    public void sendPasswordReset(
        User user,
        String token
    ) {
        String subject =
            "Reset Your Password - SkillForge";

        String resetLink =
            frontendUrl
                + "/reset-password?token="
                + token;

        String body = """
            <!DOCTYPE html>
            <html>
            <body style="margin:0;background:#f4f6f9;font-family:Arial,sans-serif;padding:30px;">
              <div style="max-width:620px;margin:auto;background:#ffffff;border-radius:12px;padding:32px;">
                <h2 style="color:#0d6efd;margin-top:0;">Reset Your Password</h2>

                <p>Hello <strong>%s</strong>,</p>

                <p>
                  We received a request to reset the password for your
                  SkillForge account (<strong>%s</strong>).
                </p>

                <div style="margin:28px 0;">
                  <a href="%s"
                     style="background:#0d6efd;color:#ffffff;padding:12px 20px;text-decoration:none;border-radius:6px;">
                    Reset Password
                  </a>
                </div>

                <p style="color:#6c757d;font-size:14px;">
                  This link expires in 30 minutes. If you did not request
                  a password reset, you can safely ignore this email.
                </p>

                <p>
                  Regards,<br>
                  <strong>SkillForge Team</strong>
                </p>
              </div>
            </body>
            </html>
            """.formatted(
                safeName(user),
                user.getEmail(),
                resetLink
            );

        sendSafely(
            user.getEmail(),
            subject,
            body,
            "password reset"
        );
    }

    private String safeName(User user) {
        String firstName =
            user.getFirstName() == null
                ? ""
                : user.getFirstName();

        String lastName =
            user.getLastName() == null
                ? ""
                : user.getLastName();

        String fullName =
            (firstName + " " + lastName).trim();

        return fullName.isBlank()
            ? "Learner"
            : fullName;
    }

    private void sendSafely(
        String recipient,
        String subject,
        String body,
        String emailType
    ) {
        try {
            emailClient.sendEmail(
                new EmailRequest(
                    recipient,
                    subject,
                    body
                )
            );

            logger.info(
                "{} email requested for {}",
                emailType,
                recipient
            );
        } catch (Exception exception) {
            /*
             * An email failure must not cancel a completed
             * payment, certificate or evaluation.
             */
            logger.error(
                "Unable to send {} email to {}",
                emailType,
                recipient,
                exception
            );
        }
    }
}