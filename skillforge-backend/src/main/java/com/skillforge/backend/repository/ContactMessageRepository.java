package com.skillforge.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.skillforge.backend.entity.ContactMessage;

public interface ContactMessageRepository
        extends JpaRepository<ContactMessage, Long> {

}