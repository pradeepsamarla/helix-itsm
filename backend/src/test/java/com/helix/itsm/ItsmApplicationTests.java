package com.helix.itsm;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class ItsmApplicationTests {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry registry) {
        // Disable Redis health/usage during the context smoke test.
        registry.add("management.health.redis.enabled", () -> "false");
    }

    @LocalServerPort
    int port;

    @Autowired
    TestRestTemplate rest;

    @Test
    void contextLoadsAndSeedDataIsPresent() {
        ResponseEntity<String> response =
                rest.getForEntity("http://localhost:" + port + "/api/incidents", String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        // Two incidents are seeded by Flyway V2.
        assertThat(response.getBody()).contains("INC0000001");
    }

    @Test
    void dashboardStatsAvailable() {
        ResponseEntity<String> response =
                rest.getForEntity("http://localhost:" + port + "/api/dashboard/stats", String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("byStatus");
    }
}
