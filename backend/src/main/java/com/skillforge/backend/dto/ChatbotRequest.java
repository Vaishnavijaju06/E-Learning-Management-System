package com.skillforge.backend.dto;

import com.skillforge.backend.enums.ChatIntent;
import com.skillforge.backend.enums.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatbotRequest {
	private String message;
	private String conversationId;
	private Role role;
	private String userName;
	private ChatIntent intent;
	private ChatbotContext context;
}