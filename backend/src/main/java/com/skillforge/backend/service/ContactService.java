package com.skillforge.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.skillforge.backend.dto.contact.ContactRequestDto;
import com.skillforge.backend.dto.contact.ContactResponseDto;
import com.skillforge.backend.entity.ContactMessage;
import com.skillforge.backend.repository.ContactMessageRepository;

@Service
public class ContactService {

    private final ContactMessageRepository repository;
    private final MappingService mappingService;

    public ContactService(
            ContactMessageRepository repository,
            MappingService mappingService) {

        this.repository = repository;
        this.mappingService = mappingService;
    }

    @Transactional
    public ContactResponseDto create(ContactRequestDto request) {

        ContactMessage contact = new ContactMessage();

        contact.setName(request.getName().trim());
        contact.setEmail(request.getEmail().trim());
        contact.setSubject(request.getSubject().trim());
        contact.setMessage(request.getMessage().trim());

        return mappingService.toContactResponse(
                repository.save(contact));
    }

    @Transactional(readOnly = true)
    public List<ContactResponseDto> findAll() {

        return repository.findAll()
                .stream()
                .map(mappingService::toContactResponse)
                .toList();
    }

}