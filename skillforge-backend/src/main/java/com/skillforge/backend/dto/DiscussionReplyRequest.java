package com.skillforge.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DiscussionReplyRequest(

    @NotBlank
    @Size(max = 2000)
    String message

) {
}