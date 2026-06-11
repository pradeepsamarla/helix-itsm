package com.helix.itsm.incident.dto;

import com.helix.itsm.incident.IncidentStatus;
import com.helix.itsm.incident.Level;
import com.helix.itsm.incident.Priority;

import java.time.OffsetDateTime;

public record IncidentSummaryDto(
        Long id,
        String number,
        String title,
        IncidentStatus status,
        Priority priority,
        Level impact,
        Level urgency,
        RefDto category,
        RefDto assignee,
        RefDto assignedGroup,
        OffsetDateTime slaDueAt,
        boolean slaBreached,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
}
