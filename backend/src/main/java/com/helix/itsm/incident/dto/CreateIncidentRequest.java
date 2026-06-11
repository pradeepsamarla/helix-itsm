package com.helix.itsm.incident.dto;

import com.helix.itsm.incident.Level;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateIncidentRequest(
        @NotBlank @Size(max = 250) String title,
        String description,
        @NotNull Level impact,
        @NotNull Level urgency,
        Long categoryId,
        Long reporterId,
        Long assigneeId,
        Long assignedGroupId
) {
}
