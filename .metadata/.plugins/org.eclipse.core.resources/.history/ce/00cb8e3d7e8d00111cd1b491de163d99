package com.skillforge.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.skillforge.backend.client.EmailClient;
import com.skillforge.backend.dto.EmailRequest;
import com.skillforge.backend.entity.Certificate;
import com.skillforge.backend.entity.Payment;
import com.skillforge.backend.entity.User;

@Service
public class NotificationService {

    private final EmailClient emailClient;
    private final boolean enabled;

    public NotificationService(
        EmailClient emailClient,
        @Value("${app.notifications.enabled}") boolean enabled
    ) {
        this.emailClient = emailClient;
        this.enabled = enabled;
    }

    public void sendWelcome(User user) {
        if (!enabled) {
            return;
        }

        emailClient.send(
            new EmailRequest(
                user.getEmail(),
                "Welcome to SkillForge",
                "<h2>Welcome, "
                    + escape(user.getFirstName())
                    + "!</h2><p>Your SkillForge account has been created.</p>"
            )
        );
    }

    public void sendPaymentConfirmation(Payment payment) {
        if (!enabled) {
            return;
        }

        emailClient.send(
            new EmailRequest(
                payment.getStudent().getEmail(),
                "SkillForge payment confirmation",
                "<h2>Payment successful</h2><p>You now have access to "
                    + escape(payment.getCourse().getTitle())
                    + ".</p><p>Reference: "
                    + escape(payment.getTransactionReference())
                    + "</p>"
            )
        );
    }

    public void sendCertificate(Certificate certificate) {
        if (!enabled) {
            return;
        }

        emailClient.send(
            new EmailRequest(
                certificate.getStudent().getEmail(),
                "Your SkillForge certificate",
                "<h2>Congratulations!</h2><p>Your certificate for "
                    + escape(certificate.getCourse().getTitle())
                    + " is ready.</p><p>Certificate number: "
                    + escape(certificate.getSerialNumber())
                    + "</p>"
            )
        );
    }

    private String escape(String value) {
        return value
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;");
    }
}
