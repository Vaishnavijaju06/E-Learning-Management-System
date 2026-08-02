package com.skillforge.backend.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record QuizCreateRequest(
    @NotBlank @Size(max = 180) String title,
    @NotNull @Min(1) Integer passingMarks,
    @NotNull @Min(1) Integer maxAttempts,
    boolean published,
    @NotEmpty List<@Valid QuestionInput> questions
) {
    public record QuestionInput(
        @NotBlank @Size(max = 2000) String text,
        @NotNull @Min(1) Integer marks,
        @NotEmpty
        @Size(min = 2, max = 6)
        List<@Valid OptionInput> options
    ) {
    }

    public record OptionInput(
        @NotBlank @Size(max = 500) String text,
        boolean correct
    ) {
    }
}
