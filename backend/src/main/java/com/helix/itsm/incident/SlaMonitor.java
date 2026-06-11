package com.helix.itsm.incident;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;

/**
 * Flags incidents whose resolution SLA target has passed while still open.
 * Runs periodically; in production this would also raise notifications/escalations.
 */
@Component
public class SlaMonitor {

    private static final Set<IncidentStatus> OPEN_STATES =
            EnumSet.of(IncidentStatus.NEW, IncidentStatus.ASSIGNED,
                    IncidentStatus.IN_PROGRESS, IncidentStatus.ON_HOLD);

    private final IncidentRepository incidentRepository;

    public SlaMonitor(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    @Scheduled(fixedDelayString = "${itsm.sla.scan-interval-ms:60000}")
    @Transactional
    public void scanForBreaches() {
        OffsetDateTime now = OffsetDateTime.now();
        List<Incident> all = incidentRepository.findAll();
        for (Incident incident : all) {
            if (incident.isSlaBreached()) {
                continue;
            }
            if (incident.getSlaDueAt() != null
                    && incident.getSlaDueAt().isBefore(now)
                    && OPEN_STATES.contains(incident.getStatus())) {
                incident.setSlaBreached(true);
                incidentRepository.save(incident);
            }
        }
    }
}
