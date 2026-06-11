package com.helix.itsm.incident.dto;

import com.helix.itsm.incident.IncidentStatus;
import com.helix.itsm.incident.Level;

/**
 * Partial update. Null fields are left unchanged. {@code status} transitions
 * are validated against the incident state machine.
 */
public record UpdateIncidentRequest(
        String title,
        String description,
        IncidentStatus status,
        Level impact,
        Level urgency,
        Long categoryId,
        Long assigneeId,
        Long assignedGroupId,
        String resolution
) {
}
