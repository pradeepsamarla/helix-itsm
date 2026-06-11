package com.helix.itsm.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI helixItsmOpenAPI() {
        return new OpenAPI().info(new Info()
                .title("Helix ITSM API")
                .description("Incident Management API (pilot)")
                .version("v0.1.0")
                .license(new License().name("Proprietary")));
    }
}
