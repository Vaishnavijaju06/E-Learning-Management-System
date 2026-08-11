package com.skillforge.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.skillforge.backend.service.DemoDataService;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedData(
        DemoDataService demoDataService,
        @Value("${app.default-admin.email}") String adminEmail,
        @Value("${app.default-admin.password}") String adminPassword,
        @Value("${app.seed-demo-data}") boolean seedDemoData
    ) {
        return args ->
            demoDataService.seed(
                adminEmail,
                adminPassword,
                seedDemoData
            );
    }
}
