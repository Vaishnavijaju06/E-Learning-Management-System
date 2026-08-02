package com.skillforge.backend.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillforge.backend.client.ChatbotClient;
import com.skillforge.backend.dto.ChatbotRequest;
import com.skillforge.backend.dto.ChatbotResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    private final ChatbotClient chatbotClient;

    public ChatbotController(ChatbotClient chatbotClient) {
        this.chatbotClient = chatbotClient;
    }

    @PostMapping("/chat")
    @PreAuthorize(
        "hasAnyRole('STUDENT', 'INSTRUCTOR', 'ADMIN')"
    )
    public ChatbotResponse chat(
        @Valid @RequestBody ChatbotRequest request
    ) {
        return chatbotClient.send(request);
    }
}
