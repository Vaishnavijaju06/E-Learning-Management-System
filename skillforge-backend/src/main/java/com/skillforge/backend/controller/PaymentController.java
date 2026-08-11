package com.skillforge.backend.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import com.skillforge.backend.dto.RazorpayOrderResponse;
import jakarta.validation.Valid;

import com.skillforge.backend.dto.RazorpayVerificationRequest;

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

    
    @PostMapping("/razorpay/orders/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public RazorpayOrderResponse createRazorpayOrder(
        @PathVariable Long courseId
    ) {
        return paymentService
            .createRazorpayOrder(courseId);
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
    
    @PostMapping("/razorpay/verify")
    @PreAuthorize("hasRole('STUDENT')")
    public PaymentResponse verifyRazorpayPayment(
        @Valid
        @RequestBody
        RazorpayVerificationRequest request
    ) {
        return paymentService
            .verifyRazorpayPayment(request);
    }
}
