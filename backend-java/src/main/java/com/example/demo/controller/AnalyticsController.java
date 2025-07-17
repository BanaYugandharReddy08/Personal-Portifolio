package com.example.demo.controller;

import com.example.demo.model.AnalyticsEventEntity.EventType;
import com.example.demo.service.AnalyticsService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("")
    public ResponseEntity<?> getAnalytics(@RequestParam(required = false) String start,
                                          @RequestParam(required = false) String end) {
        Instant startInstant = start != null ? Instant.parse(start) : null;
        Instant endInstant = end != null ? Instant.parse(end) : null;
        return ResponseEntity.ok(analyticsService.getCounts(startInstant, endInstant));
    }
}
