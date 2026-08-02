package com.skillforge.backend.dto;

public record ChatbotResponse(
    String answer,
    String conversationId,
    String model
) {
}
