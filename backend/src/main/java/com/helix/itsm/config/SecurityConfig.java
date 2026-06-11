package com.helix.itsm.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class SecurityConfig {

    @Value("${itsm.security.dev-mode:true}")
    private boolean devMode;

    @Value("${keycloak.issuer-uri:}")
    private String issuerUri;

    @Value("${itsm.cors.allowed-origins:http://localhost:5173}")
    private String allowedOrigins;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        if (devMode) {
            // Pilot mode: API is open so it runs without Keycloak wired in.
            http.authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        } else {
            http.authorizeHttpRequests(auth -> auth
                            .requestMatchers(HttpMethod.GET, "/actuator/health", "/actuator/info").permitAll()
                            .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                            .anyRequest().authenticated())
                    .oauth2ResourceServer(oauth -> oauth.jwt(jwt -> {}));
        }
        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        // Only used when dev-mode is false and a valid issuer URI is configured.
        if (devMode || issuerUri == null || issuerUri.isBlank()) {
            return token -> {
                throw new UnsupportedOperationException("JWT decoding is disabled in dev mode");
            };
        }
        return JwtDecoders.fromIssuerLocation(issuerUri);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        List<String> origins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
        config.setAllowedOrigins(origins);
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
