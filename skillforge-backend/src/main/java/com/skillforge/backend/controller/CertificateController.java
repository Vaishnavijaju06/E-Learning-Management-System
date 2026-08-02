package com.skillforge.backend.controller;

import java.util.List;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillforge.backend.dto.CertificateResponse;
import com.skillforge.backend.service.CertificateService;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    private final CertificateService certificateService;

    public CertificateController(
        CertificateService certificateService
    ) {
        this.certificateService = certificateService;
    }

    @PostMapping("/course/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public CertificateResponse issue(
        @PathVariable Long courseId
    ) {
        return certificateService.issue(courseId);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public List<CertificateResponse> findMine() {
        return certificateService.findMine();
    }

    @GetMapping("/verify/{serialNumber}")
    public CertificateResponse verify(
        @PathVariable String serialNumber
    ) {
        return certificateService.verify(serialNumber);
    }

    @GetMapping("/{serialNumber}/download")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<byte[]> download(
        @PathVariable String serialNumber
    ) {
        byte[] pdf = certificateService.download(serialNumber);

        return ResponseEntity
            .ok()
            .contentType(MediaType.APPLICATION_PDF)
            .header(
                HttpHeaders.CONTENT_DISPOSITION,
                ContentDisposition
                    .attachment()
                    .filename(
                        "SkillForge-"
                            + serialNumber
                            + ".pdf"
                    )
                    .build()
                    .toString()
            )
            .body(pdf);
    }
}
