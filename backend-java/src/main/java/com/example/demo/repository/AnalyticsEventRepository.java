package com.example.demo.repository;

import com.example.demo.model.AnalyticsEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;

public interface AnalyticsEventRepository extends JpaRepository<AnalyticsEventEntity, Long> {
    long countByEventType(String eventType);
    long countByEventTypeAndTimestampBetween(String eventType, Instant start, Instant end);
}
