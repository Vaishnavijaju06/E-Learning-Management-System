package com.skillforge.backend.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillforge.backend.dto.PaymentRequest;
import com.skillforge.backend.dto.PaymentResponse;
import com.skillforge.backend.service.PaymentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/checkout")
    @PreAuthorize("hasRole('STUDENT')")
    public PaymentResponse checkout(
        @Valid @RequestBody PaymentRequest request
    ) {
        return paymentService.checkout(request);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public List<PaymentResponse> findMine() {
        return paymentService.findMyPayments();
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<PaymentResponse> findAll() {
        return paymentService.findAll();
    }
}
