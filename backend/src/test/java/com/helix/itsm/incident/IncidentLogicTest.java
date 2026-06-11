package com.helix.itsm.incident;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class IncidentLogicTest {

    @Test
    void priorityMatrixFollowsItil() {
        assertThat(Priority.fromMatrix(Level.HIGH, Level.HIGH)).isEqualTo(Priority.CRITICAL);
        assertThat(Priority.fromMatrix(Level.HIGH, Level.MEDIUM)).isEqualTo(Priority.HIGH);
        assertThat(Priority.fromMatrix(Level.MEDIUM, Level.MEDIUM)).isEqualTo(Priority.MEDIUM);
        assertThat(Priority.fromMatrix(Level.LOW, Level.LOW)).isEqualTo(Priority.LOW);
    }

    @Test
    void resolutionTargetsDescendWithPriority() {
        assertThat(Priority.CRITICAL.getResolutionHours())
                .isLessThan(Priority.HIGH.getResolutionHours());
        assertThat(Priority.HIGH.getResolutionHours())
                .isLessThan(Priority.MEDIUM.getResolutionHours());
        assertThat(Priority.MEDIUM.getResolutionHours())
                .isLessThan(Priority.LOW.getResolutionHours());
    }

    @Test
    void stateMachineAllowsValidTransitions() {
        assertThat(IncidentStatus.NEW.canTransitionTo(IncidentStatus.IN_PROGRESS)).isTrue();
        assertThat(IncidentStatus.IN_PROGRESS.canTransitionTo(IncidentStatus.RESOLVED)).isTrue();
        assertThat(IncidentStatus.RESOLVED.canTransitionTo(IncidentStatus.CLOSED)).isTrue();
    }

    @Test
    void stateMachineRejectsInvalidTransitions() {
        assertThat(IncidentStatus.NEW.canTransitionTo(IncidentStatus.CLOSED)).isFalse();
        assertThat(IncidentStatus.CLOSED.canTransitionTo(IncidentStatus.NEW)).isFalse();
        assertThat(IncidentStatus.CLOSED.isTerminal()).isTrue();
    }
}
