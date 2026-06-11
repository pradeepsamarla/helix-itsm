package com.helix.itsm.incident.dto;

import com.helix.itsm.incident.IncidentStatus;
import com.helix.itsm.incident.Level;
import com.helix.itsm.incident.Priority;

import java.time.OffsetDateTime;
import java.util.List;

public record IncidentDetailDto(
        Long id,
        String number,
        String title,
        String description,
        IncidentStatus status,
        List<IncidentStatus> allowedNextStatuses,
        Priority priority,
        Level impact,
        Level urgency,
        RefDto category,
        RefDto reporter,
        RefDto assignee,
        RefDto assignedGroup,
        String resolution,
        OffsetDateTime slaDueAt,
        boolean slaBreached,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt,
        OffsetDateTime resolvedAt,
        OffsetDateTime closedAt,
        List<CommentDto> comments,
        List<ActivityDto> activity
) {
}
