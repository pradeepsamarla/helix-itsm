package com.helix.itsm.incident.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateCommentRequest(
        @NotBlank String body,
        boolean internal,
        Long authorId
) {
}
