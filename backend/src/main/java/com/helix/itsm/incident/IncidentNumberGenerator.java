package com.helix.itsm.incident;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Component;

@Component
public class IncidentNumberGenerator {

    @PersistenceContext
    private EntityManager entityManager;

    public String next() {
        Object value = entityManager
                .createNativeQuery("SELECT nextval('incident_number_seq')")
                .getSingleResult();
        long seq = ((Number) value).longValue();
        return String.format("INC%07d", seq);
    }
}
