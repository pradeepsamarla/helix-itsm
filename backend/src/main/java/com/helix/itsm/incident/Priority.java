package com.helix.itsm.incident;

/**
 * ITIL priority derived from the impact x urgency matrix.
 * Each priority carries a default resolution SLA target (in hours).
 */
public enum Priority {
    CRITICAL(4),
    HIGH(8),
    MEDIUM(24),
    LOW(72);

    private final int resolutionHours;

    Priority(int resolutionHours) {
        this.resolutionHours = resolutionHours;
    }

    public int getResolutionHours() {
        return resolutionHours;
    }

    /**
     * Standard ITIL impact/urgency priority matrix.
     */
    public static Priority fromMatrix(Level impact, Level urgency) {
        int score = impact.weight() + urgency.weight();
        if (impact == Level.HIGH && urgency == Level.HIGH) {
            return CRITICAL;
        }
        return switch (score) {
            case 6, 5 -> HIGH;     // HIGH/HIGH handled above; covers HIGH+MEDIUM
            case 4    -> MEDIUM;
            default   -> LOW;
        };
    }
}
