package com.skillforge.backend.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.skillforge.backend.dto.EmailRequest;

@Component
public class EmailClient {

    private static final Logger log =
        LoggerFactory.getLogger(EmailClient.class);

    private final RestClient restClient;

    public EmailClient(
        RestClient.Builder builder,
        @Value("${email.service.url}") String serviceUrl,
        @Value("${email.service.internal-api-key}")
        String internalApiKey
    ) {
        restClient = builder
            .baseUrl(serviceUrl)
            .defaultHeader(
                "X-Internal-Api-Key",
                internalApiKey
            )
            .build();
    }

    @Async
    public void sendEmail(EmailRequest request) {
        try {
            restClient
                .post()
                .uri("/api/email/send")
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .toBodilessEntity();
        } catch (Exception exception) {
            log.warn(
                "Email notification could not be sent: {}",
                exception.getMessage()
            );
        }
    }
}
