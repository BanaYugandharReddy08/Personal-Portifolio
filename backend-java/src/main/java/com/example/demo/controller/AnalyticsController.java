package com.example.demo.controller;

import com.example.demo.model.AnalyticsEventEntity.EventType;
import com.example.demo.service.AnalyticsService;
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

        Map<String, Long> result = Map.of(
                "guestLogins", analyticsService.countEvents(EventType.GUEST_LOGIN, startInstant, endInstant),
                "signups", analyticsService.countEvents(EventType.USER_SIGNUP, startInstant, endInstant),
                "cvDownloads", analyticsService.countEvents(EventType.CV_DOWNLOAD, startInstant, endInstant),
                "coverletterDownloads", analyticsService.countEvents(EventType.COVERLETTER_DOWNLOAD, startInstant, endInstant)
        );

        return ResponseEntity.ok(result);
    }
}
