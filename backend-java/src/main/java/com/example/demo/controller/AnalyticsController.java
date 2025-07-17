package com.example.demo.controller;

import com.example.demo.model.AnalyticsEventEntity.EventType;
import com.example.demo.service.AnalyticsService;
import org.springframework.format.annotation.DateTimeFormat;
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
    public Map<String, Long> getAnalytics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant end) {
        return Map.of(
                "guestLogins", analyticsService.countEvents(EventType.GUEST_LOGIN, start, end),
                "signups", analyticsService.countEvents(EventType.USER_SIGNUP, start, end),
                "cvDownloads", analyticsService.countEvents(EventType.CV_DOWNLOAD, start, end),
                "coverletterDownloads", analyticsService.countEvents(EventType.COVERLETTER_DOWNLOAD, start, end)
        );
    }
}
