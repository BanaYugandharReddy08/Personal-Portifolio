package com.example.demo.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "analytics_events")
public class AnalyticsEventEntity {

    public enum EventType {
        GUEST_LOGIN,
        USER_SIGNUP,
        CV_DOWNLOAD,
        COVERLETTER_DOWNLOAD
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventType eventType;

    @Column(nullable = false, updatable = false)
    private Instant timestamp;

    public AnalyticsEventEntity() {
    }

    public AnalyticsEventEntity(EventType eventType, Instant timestamp) {
        this.eventType = eventType;
        this.timestamp = timestamp;
    }

    @PrePersist
    private void onCreate() {
        if (timestamp == null) {
            timestamp = Instant.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public EventType getEventType() {
        return eventType;
    }

    public void setEventType(EventType eventType) {
        this.eventType = eventType;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
}
