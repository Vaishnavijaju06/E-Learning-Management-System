package com.skillforge.backend.controller;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillforge.backend.dto.ChatbotRequest;
import com.skillforge.backend.dto.ChatbotResponse;
import com.skillforge.backend.service.ChatbotOrchestratorService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/chatbot")
@Validated
public class ChatbotController {

	private final ChatbotOrchestratorService chatbotOrchestratorService;

	public ChatbotController(ChatbotOrchestratorService chatbotOrchestratorService) {

		this.chatbotOrchestratorService = chatbotOrchestratorService;
	}

	@PostMapping("/chat")
	public ChatbotResponse chat(@Valid @RequestBody ChatbotRequest request, Authentication authentication) {

		return chatbotOrchestratorService.processChat(request, authentication);
	}
}