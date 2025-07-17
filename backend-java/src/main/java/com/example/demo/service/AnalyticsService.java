package com.example.demo.service;

import com.example.demo.model.AnalyticsEventEntity;
import com.example.demo.model.AnalyticsEventEntity.EventType;
import com.example.demo.repository.AnalyticsEventRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class AnalyticsService {

    public static final EventType EVENT_GUEST_LOGIN = EventType.GUEST_LOGIN;
    public static final EventType EVENT_USER_SIGNUP = EventType.USER_SIGNUP;
    public static final EventType EVENT_CV_DOWNLOAD = EventType.CV_DOWNLOAD;
    public static final EventType EVENT_COVERLETTER_DOWNLOAD = EventType.COVERLETTER_DOWNLOAD;

    private final AnalyticsEventRepository repository;

    public AnalyticsService(AnalyticsEventRepository repository) {
        this.repository = repository;
    }

    public void recordEvent(EventType type) {
        AnalyticsEventEntity entity = new AnalyticsEventEntity();
        entity.setEventType(type);
        repository.save(entity);
    }

    public long countEvents(EventType type, Instant start, Instant end) {
        if (start != null && end != null) {
            return repository.countByEventTypeAndTimestampBetween(type, start, end);
        }
        if (start != null) {
            return repository.countByEventTypeAndTimestampBetween(type, start, Instant.now());
        }
        if (end != null) {
            return repository.countByEventTypeAndTimestampBetween(type, Instant.EPOCH, end);
        }
        return repository.countByEventType(type);
    }
}
