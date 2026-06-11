package com.helix.itsm.incident.dto;

import java.util.Map;

public record DashboardStatsDto(
        long total,
        long open,
        long resolved,
        long slaBreached,
        Map<String, Long> byStatus,
        Map<String, Long> byPriority
) {
}
