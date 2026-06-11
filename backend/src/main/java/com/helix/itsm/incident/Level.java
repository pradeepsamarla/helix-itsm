package com.helix.itsm.incident;

/**
 * Shared scale used for both impact and urgency.
 */
public enum Level {
    LOW(1),
    MEDIUM(2),
    HIGH(3);

    private final int weight;

    Level(int weight) {
        this.weight = weight;
    }

    public int weight() {
        return weight;
    }
}
