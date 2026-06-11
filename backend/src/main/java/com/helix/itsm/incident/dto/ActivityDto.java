package com.helix.itsm.incident.dto;

import java.time.OffsetDateTime;

public record ActivityDto(
        Long id,
        RefDto actor,
        String field,
        String oldValue,
        String newValue,
        OffsetDateTime createdAt
) {
}
