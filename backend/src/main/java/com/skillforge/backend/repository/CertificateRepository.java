package com.skillforge.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skillforge.backend.entity.Certificate;

public interface CertificateRepository
    extends JpaRepository<Certificate, Long> {

    Optional<Certificate> findBySerialNumber(String serialNumber);

    Optional<Certificate> findByStudentIdAndCourseId(
        Long studentId,
        Long courseId
    );

    List<Certificate> findByStudentIdOrderByIssuedAtDesc(Long studentId);

    long countByStudentId(Long studentId);
}
