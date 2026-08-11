package com.skillforge.backend.service;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.razorpay.Utils;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.skillforge.backend.exception.ExternalServiceException;

@Service
public class RazorpayService {

    private final String keyId;
    private final String keySecret;
    private final String currency;

    public RazorpayService(
        @Value("${razorpay.key-id}")
        String keyId,

        @Value("${razorpay.key-secret}")
        String keySecret,

        @Value("${razorpay.currency:INR}")
        String currency
    ) {
        this.keyId = keyId;
        this.keySecret = keySecret;
        this.currency = currency;
    }

    public Order createOrder(
        long amountInPaise,
        String receipt,
        Long studentId,
        Long courseId
    ) {
        if (
            keyId == null
            || keyId.isBlank()
            || keySecret == null
            || keySecret.isBlank()
        ) {
            throw new IllegalStateException(
                "Razorpay API keys are not configured"
            );
        }

        try {
            RazorpayClient razorpayClient =
                new RazorpayClient(
                    keyId,
                    keySecret
                );

            JSONObject orderRequest =
                new JSONObject();

            orderRequest.put(
                "amount",
                amountInPaise
            );

            orderRequest.put(
                "currency",
                currency
            );

            orderRequest.put(
                "receipt",
                receipt
            );

            JSONObject notes = new JSONObject();

            notes.put(
                "studentId",
                studentId
            );

            notes.put(
                "courseId",
                courseId
            );

            orderRequest.put(
                "notes",
                notes
            );

            return razorpayClient
                .orders
                .create(orderRequest);

        } catch (RazorpayException exception) {
            throw new ExternalServiceException(
                "Unable to create Razorpay order",
                exception
            );
        }
    }

    public boolean verifyPaymentSignature(
    	    String storedOrderId,
    	    String razorpayPaymentId,
    	    String razorpaySignature
    	) {
    	    try {
    	        JSONObject verificationData = new JSONObject();

    	        verificationData.put(
    	            "razorpay_order_id",
    	            storedOrderId
    	        );

    	        verificationData.put(
    	            "razorpay_payment_id",
    	            razorpayPaymentId
    	        );

    	        verificationData.put(
    	            "razorpay_signature",
    	            razorpaySignature
    	        );

    	        return Utils.verifyPaymentSignature(
    	            verificationData,
    	            keySecret
    	        );
    	    } catch (RazorpayException exception) {
    	        throw new ExternalServiceException(
    	            "Unable to verify Razorpay payment",
    	            exception
    	        );
    	    }
    	}
    public String getKeyId() {
        return keyId;
    }

    public String getCurrency() {
        return currency;
    }
}