package com.helix.itsm.dashboard;

import com.helix.itsm.incident.IncidentService;
import com.helix.itsm.incident.dto.DashboardStatsDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final IncidentService incidentService;

    public DashboardController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @GetMapping("/stats")
    public DashboardStatsDto stats() {
        return incidentService.stats();
    }
}
