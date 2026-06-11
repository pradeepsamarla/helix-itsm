package com.helix.itsm.incident;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface IncidentRepository
        extends JpaRepository<Incident, Long>, JpaSpecificationExecutor<Incident> {

    long countByStatus(IncidentStatus status);

    long countByPriority(Priority priority);

    long countBySlaBreachedTrue();
}
