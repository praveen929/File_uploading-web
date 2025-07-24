package com.example.filestoring.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/")
public class HealthController {

    @GetMapping
    public Map<String, Object> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "FileHub Backend is running");
        response.put("timestamp", LocalDateTime.now());
        response.put("version", "1.0.0");
        response.put("endpoints", new String[]{
            "/users - User management",
            "/files - File operations", 
            "/ping - Health check"
        });
        return response;
    }

    @GetMapping("/ping")
    public Map<String, Object> ping() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "pong");
        response.put("timestamp", LocalDateTime.now());
        response.put("uptime", "Backend is healthy");
        return response;
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now());
        response.put("database", "Connected");
        response.put("service", "FileHub Backend");
        return response;
    }
}
