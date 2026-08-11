package com.skillforge.backend.client;

import java.net.http.HttpClient;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import com.skillforge.backend.dto.ChatbotRequest;
import com.skillforge.backend.dto.ChatbotResponse;
import com.skillforge.backend.exception.ExternalServiceException;

@Component
public class ChatbotClient {

    private final RestClient restClient;

    public ChatbotClient(
        RestClient.Builder builder,
        @Value("${chatbot.service.url}")
        String serviceUrl,
        @Value("${chatbot.service.internal-api-key}")
        String internalApiKey
    ) {
        HttpClient httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_1_1)
            .build();

        restClient = builder
            .requestFactory(
                new JdkClientHttpRequestFactory(httpClient)
            )
            .baseUrl(serviceUrl)
            .defaultHeader(
                "X-Internal-Api-Key",
                internalApiKey
            )
            .build();
    }

    public ChatbotResponse send(ChatbotRequest request) {
        try {
            ChatbotResponse response = restClient
                .post()
                .uri("/api/chatbot/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .body(ChatbotResponse.class);

            if (response == null) {
                throw new ExternalServiceException(
                    "Chatbot returned an empty response",
                    null
                );
            }

            return response;
        } catch (RestClientException exception) {
            throw new ExternalServiceException(
                "Chatbot service is currently unavailable",
                exception
            );
        }
    }
}