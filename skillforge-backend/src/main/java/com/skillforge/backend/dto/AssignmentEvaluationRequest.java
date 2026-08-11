package com.skillforge.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AssignmentEvaluationRequest(

    @NotNull
    @Min(0)
    Integer marksObtained,

    @Size(max = 1500)
    String feedback

) {
}