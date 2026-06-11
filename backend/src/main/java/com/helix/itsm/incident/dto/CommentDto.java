package com.helix.itsm.incident.dto;

import java.time.OffsetDateTime;

public record CommentDto(
        Long id,
        RefDto author,
        String body,
        boolean internal,
        OffsetDateTime createdAt
) {
}
