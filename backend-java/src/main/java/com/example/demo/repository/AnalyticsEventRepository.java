package com.example.demo.repository;

import com.example.demo.model.AnalyticsEventEntity;
import com.example.demo.model.AnalyticsEventEntity.EventType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;

public interface AnalyticsEventRepository extends JpaRepository<AnalyticsEventEntity, Long> {
    long countByEventTypeAndTimestampBetween(EventType eventType, Instant start, Instant end);
    long countByEventType(EventType eventType);
}
