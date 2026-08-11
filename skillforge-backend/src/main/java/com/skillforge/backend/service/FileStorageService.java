package com.skillforge.backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.skillforge.backend.exception.BadRequestException;

@Service
public class FileStorageService {

    private static final Set<String> ALLOWED_EXTENSIONS =
        Set.of(
            "pdf",
            "doc",
            "docx",
            "txt",
            "zip"
        );

    private final Path assignmentDirectory;
    private final Path submissionDirectory;

    public FileStorageService(
        @Value("${app.upload.assignment-dir}")
        String assignmentDirectory,

        @Value("${app.upload.submission-dir}")
        String submissionDirectory
    ) {
        this.assignmentDirectory =
            Paths.get(assignmentDirectory)
                .toAbsolutePath()
                .normalize();

        this.submissionDirectory =
            Paths.get(submissionDirectory)
                .toAbsolutePath()
                .normalize();

        try {
            Files.createDirectories(
                this.assignmentDirectory
            );

            Files.createDirectories(
                this.submissionDirectory
            );
        } catch (IOException exception) {
            throw new IllegalStateException(
                "Unable to create upload directories",
                exception
            );
        }
    }

    public String storeAssignmentFile(
        MultipartFile file
    ) {
        return store(
            file,
            assignmentDirectory
        );
    }

    public String storeSubmissionFile(
        MultipartFile file
    ) {
        return store(
            file,
            submissionDirectory
        );
    }

    private String store(
        MultipartFile file,
        Path directory
    ) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException(
                "File is required"
            );
        }

        String originalName =
            file.getOriginalFilename();

        String extension =
            getExtension(originalName);

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new BadRequestException(
                "Only PDF, DOC, DOCX, TXT and ZIP files are allowed"
            );
        }

        String generatedName =
            UUID.randomUUID() + "." + extension;

        Path destination =
            directory.resolve(generatedName)
                .normalize();

        if (!destination.startsWith(directory)) {
            throw new BadRequestException(
                "Invalid file path"
            );
        }

        try {
            file.transferTo(destination);

            return destination.toString();
        } catch (IOException exception) {
            throw new BadRequestException(
                "Unable to save uploaded file"
            );
        }
    }

    public Resource load(String storedPath) {
        if (
            storedPath == null
            || storedPath.isBlank()
        ) {
            throw new BadRequestException(
                "File is not available"
            );
        }

        try {
            Path path =
                Paths.get(storedPath)
                    .toAbsolutePath()
                    .normalize();

            Resource resource =
                new UrlResource(path.toUri());

            if (!resource.exists()) {
                throw new BadRequestException(
                    "File was not found"
                );
            }

            return resource;
        } catch (Exception exception) {
            throw new BadRequestException(
                "Unable to load file"
            );
        }
    }

    private String getExtension(
        String fileName
    ) {
        if (
            fileName == null
            || !fileName.contains(".")
        ) {
            throw new BadRequestException(
                "File must have a valid extension"
            );
        }

        return fileName
            .substring(
                fileName.lastIndexOf('.') + 1
            )
            .toLowerCase();
    }
}