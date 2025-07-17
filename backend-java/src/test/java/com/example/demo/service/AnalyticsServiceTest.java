package com.example.demo.service;

import com.example.demo.model.AnalyticsEventEntity;
import com.example.demo.model.AnalyticsEventEntity.EventType;
import com.example.demo.repository.AnalyticsEventRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class AnalyticsServiceTest {

    @Autowired
    private AnalyticsEventRepository repository;

    @Test
    void recordEventPersistsEntity() {
        AnalyticsService service = new AnalyticsService(repository);
        service.recordEvent(EventType.USER_SIGNUP);

        assertThat(repository.count()).isEqualTo(1);
        AnalyticsEventEntity saved = repository.findAll().get(0);
        assertThat(saved.getEventType()).isEqualTo(EventType.USER_SIGNUP);
        assertThat(saved.getTimestamp()).isNotNull();
    }

    @Test
    void countEventsWithinRangeReturnsCorrectNumber() {
        Instant base = Instant.parse("2024-01-01T00:00:00Z");
        repository.save(new AnalyticsEventEntity(EventType.CV_DOWNLOAD, base));
        repository.save(new AnalyticsEventEntity(EventType.CV_DOWNLOAD, base.plus(2, ChronoUnit.DAYS)));
        repository.save(new AnalyticsEventEntity(EventType.CV_DOWNLOAD, base.plus(4, ChronoUnit.DAYS)));

        AnalyticsService service = new AnalyticsService(repository);
        long count = service.countEvents(EventType.CV_DOWNLOAD,
                base.plus(1, ChronoUnit.DAYS),
                base.plus(3, ChronoUnit.DAYS));
        assertThat(count).isEqualTo(1);
    }
}
