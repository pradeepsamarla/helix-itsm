package com.helix.itsm.incident;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IncidentActivityRepository extends JpaRepository<IncidentActivity, Long> {
    List<IncidentActivity> findByIncidentIdOrderByCreatedAtDesc(Long incidentId);
}
