package com.helix.itsm.incident.dto;

/**
 * Lightweight reference to a related entity (user, group, category).
 */
public record RefDto(Long id, String name) {
}
