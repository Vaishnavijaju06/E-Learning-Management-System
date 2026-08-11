package com.skillforge.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.skillforge.backend.dto.contact.ContactRequestDto;
import com.skillforge.backend.dto.contact.ContactResponseDto;
import com.skillforge.backend.service.ContactService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/contact")
@Validated
public class ContactController {

    private final ContactService service;

    public ContactController(ContactService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContactResponseDto create(
            @Valid @RequestBody ContactRequestDto request) {

        return service.create(request);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<ContactResponseDto> findAll() {

        return service.findAll();
    }

}