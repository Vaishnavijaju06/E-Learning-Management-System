package com.skillforge.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skillforge.backend.entity.Payment;
import com.skillforge.backend.enums.PaymentStatus;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByStudentIdOrderByPaidAtDesc(Long studentId);

    long countByStatus(PaymentStatus status);
}
