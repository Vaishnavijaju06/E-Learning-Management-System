package com.skillforge.backend.dto;

import java.util.Map;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatbotContext {

    private Map<String, Object> data;
}