package com.skillforge.backend.exception;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;

import com.skillforge.backend.dto.ApiError;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(
        ResourceNotFoundException exception,
        HttpServletRequest request
    ) {
        return build(
            HttpStatus.NOT_FOUND,
            exception.getMessage(),
            request,
            Map.of()
        );
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiError> handleBadRequest(
        BadRequestException exception,
        HttpServletRequest request
    ) {
        return build(
            HttpStatus.BAD_REQUEST,
            exception.getMessage(),
            request,
            Map.of()
        );
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiError> handleUnauthorized(
        UnauthorizedException exception,
        HttpServletRequest request
    ) {
        return build(
            HttpStatus.UNAUTHORIZED,
            exception.getMessage(),
            request,
            Map.of()
        );
    }

    @ExceptionHandler({
        ForbiddenException.class,
        AccessDeniedException.class
    })
    public ResponseEntity<ApiError> handleForbidden(
        RuntimeException exception,
        HttpServletRequest request
    ) {
        return build(
            HttpStatus.FORBIDDEN,
            exception.getMessage(),
            request,
            Map.of()
        );
    }

    @ExceptionHandler(ExternalServiceException.class)
    public ResponseEntity<ApiError> handleExternalService(
        ExternalServiceException exception,
        HttpServletRequest request
    ) {
        return build(
            HttpStatus.SERVICE_UNAVAILABLE,
            exception.getMessage(),
            request,
            Map.of()
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(
        MethodArgumentNotValidException exception,
        HttpServletRequest request
    ) {
        Map<String, String> errors = new LinkedHashMap<>();

        exception.getBindingResult()
            .getFieldErrors()
            .forEach(error ->
                errors.putIfAbsent(
                    error.getField(),
                    error.getDefaultMessage()
                )
            );

        return build(
            HttpStatus.BAD_REQUEST,
            "Validation failed",
            request,
            errors
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleUnexpected(
        Exception exception,
        HttpServletRequest request
    ) {
        return build(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "An unexpected error occurred",
            request,
            Map.of()
        );
    }

    private ResponseEntity<ApiError> build(
        HttpStatus status,
        String message,
        HttpServletRequest request,
        Map<String, String> validationErrors
    ) {
        ApiError error = new ApiError(
            LocalDateTime.now(),
            status.value(),
            status.getReasonPhrase(),
            message,
            request.getRequestURI(),
            validationErrors
        );

        return ResponseEntity.status(status).body(error);
    }
}
