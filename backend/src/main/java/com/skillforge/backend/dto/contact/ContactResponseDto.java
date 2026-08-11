package com.skillforge.backend.dto.contact;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContactResponseDto {

    private Long id;

    private String name;

    private String email;

    private String subject;

    private String message;
}