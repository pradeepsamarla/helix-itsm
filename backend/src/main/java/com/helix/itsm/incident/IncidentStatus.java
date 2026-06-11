package com.helix.itsm.incident;

import java.util.EnumSet;
import java.util.Set;

/**
 * Incident lifecycle states with allowed transitions (a small state machine).
 */
public enum IncidentStatus {
    NEW,
    ASSIGNED,
    IN_PROGRESS,
    ON_HOLD,
    RESOLVED,
    CLOSED,
    CANCELLED;

    public Set<IncidentStatus> allowedNext() {
        return switch (this) {
            case NEW         -> EnumSet.of(ASSIGNED, IN_PROGRESS, CANCELLED);
            case ASSIGNED    -> EnumSet.of(IN_PROGRESS, ON_HOLD, CANCELLED);
            case IN_PROGRESS -> EnumSet.of(ON_HOLD, RESOLVED, CANCELLED);
            case ON_HOLD     -> EnumSet.of(IN_PROGRESS, CANCELLED);
            case RESOLVED    -> EnumSet.of(CLOSED, IN_PROGRESS);
            case CLOSED      -> EnumSet.noneOf(IncidentStatus.class);
            case CANCELLED   -> EnumSet.noneOf(IncidentStatus.class);
        };
    }

    public boolean canTransitionTo(IncidentStatus target) {
        return this == target || allowedNext().contains(target);
    }

    public boolean isTerminal() {
        return this == CLOSED || this == CANCELLED;
    }
}
