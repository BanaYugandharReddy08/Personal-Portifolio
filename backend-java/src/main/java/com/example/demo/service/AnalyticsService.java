package com.example.demo.service;

import com.example.demo.model.AnalyticsEventEntity;
import com.example.demo.repository.AnalyticsEventRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Service
public class AnalyticsService {

    public static final String EVENT_GUEST_LOGIN = "GUEST_LOGIN";
    public static final String EVENT_USER_SIGNUP = "USER_SIGNUP";
    public static final String EVENT_CV_DOWNLOAD = "CV_DOWNLOAD";
    public static final String EVENT_COVERLETTER_DOWNLOAD = "COVERLETTER_DOWNLOAD";

    private final AnalyticsEventRepository repository;

    public AnalyticsService(AnalyticsEventRepository repository) {
        this.repository = repository;
    }

    public void recordEvent(String type) {
        AnalyticsEventEntity entity = new AnalyticsEventEntity();
        entity.setEventType(type);
        entity.setTimestamp(Instant.now());
        repository.save(entity);
    }

    public long countEvents(String type, Instant start, Instant end) {
        if (start == null && end == null) {
            return repository.countByEventType(type);
        }
        if (start == null) {
            start = Instant.EPOCH;
        }
        if (end == null) {
            end = Instant.now();
        }
        return repository.countByEventTypeAndTimestampBetween(type, start, end);
    }

    public Map<String, Long> getCounts(Instant start, Instant end) {
        Map<String, Long> result = new HashMap<>();
        result.put(EVENT_GUEST_LOGIN, countEvents(EVENT_GUEST_LOGIN, start, end));
        result.put(EVENT_USER_SIGNUP, countEvents(EVENT_USER_SIGNUP, start, end));
        result.put(EVENT_CV_DOWNLOAD, countEvents(EVENT_CV_DOWNLOAD, start, end));
        result.put(EVENT_COVERLETTER_DOWNLOAD, countEvents(EVENT_COVERLETTER_DOWNLOAD, start, end));
        return result;
    }
}
