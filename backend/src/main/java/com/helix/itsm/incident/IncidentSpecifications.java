package com.helix.itsm.incident;

import org.springframework.data.jpa.domain.Specification;

public final class IncidentSpecifications {

    private IncidentSpecifications() {
    }

    public static Specification<Incident> status(IncidentStatus status) {
        return (root, query, cb) ->
                status == null ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<Incident> priority(Priority priority) {
        return (root, query, cb) ->
                priority == null ? null : cb.equal(root.get("priority"), priority);
    }

    public static Specification<Incident> assignee(Long assigneeId) {
        return (root, query, cb) ->
                assigneeId == null ? null : cb.equal(root.get("assignee").get("id"), assigneeId);
    }

    public static Specification<Incident> group(Long groupId) {
        return (root, query, cb) ->
                groupId == null ? null : cb.equal(root.get("assignedGroup").get("id"), groupId);
    }

    public static Specification<Incident> slaBreached(Boolean breached) {
        return (root, query, cb) ->
                breached == null ? null : cb.equal(root.get("slaBreached"), breached);
    }

    public static Specification<Incident> search(String term) {
        return (root, query, cb) -> {
            if (term == null || term.isBlank()) {
                return null;
            }
            String like = "%" + term.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("number")), like),
                    cb.like(cb.lower(root.get("title")), like),
                    cb.like(cb.lower(root.get("description")), like)
            );
        };
    }
}
