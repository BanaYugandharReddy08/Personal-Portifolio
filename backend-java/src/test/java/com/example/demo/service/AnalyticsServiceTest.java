package com.example.demo.service;

import com.example.demo.model.AnalyticsEventEntity;
import com.example.demo.repository.AnalyticsEventRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceTest {

    @Mock
    private AnalyticsEventRepository repository;

    @InjectMocks
    private AnalyticsService analyticsService;

    @Test
    void recordEventStoresEntity() {
        when(repository.save(any(AnalyticsEventEntity.class))).thenAnswer(inv -> inv.getArgument(0));

        analyticsService.recordEvent(AnalyticsService.EVENT_GUEST_LOGIN);

        ArgumentCaptor<AnalyticsEventEntity> captor = ArgumentCaptor.forClass(AnalyticsEventEntity.class);
        verify(repository).save(captor.capture());
        AnalyticsEventEntity saved = captor.getValue();
        assertThat(saved.getEventType()).isEqualTo(AnalyticsService.EVENT_GUEST_LOGIN);
        assertThat(saved.getTimestamp()).isNotNull();
    }

    @Test
    void getCountsReturnsValues() {
        Instant start = Instant.now().minusSeconds(3600);
        Instant end = Instant.now();
        when(repository.countByEventTypeAndTimestampBetween(eq(AnalyticsService.EVENT_GUEST_LOGIN), any(), any())).thenReturn(1L);
        when(repository.countByEventTypeAndTimestampBetween(eq(AnalyticsService.EVENT_USER_SIGNUP), any(), any())).thenReturn(2L);
        when(repository.countByEventTypeAndTimestampBetween(eq(AnalyticsService.EVENT_CV_DOWNLOAD), any(), any())).thenReturn(3L);
        when(repository.countByEventTypeAndTimestampBetween(eq(AnalyticsService.EVENT_COVERLETTER_DOWNLOAD), any(), any())).thenReturn(4L);

        Map<String, Long> counts = analyticsService.getCounts(start, end);

        assertThat(counts).containsEntry(AnalyticsService.EVENT_GUEST_LOGIN, 1L)
                .containsEntry(AnalyticsService.EVENT_USER_SIGNUP, 2L)
                .containsEntry(AnalyticsService.EVENT_CV_DOWNLOAD, 3L)
                .containsEntry(AnalyticsService.EVENT_COVERLETTER_DOWNLOAD, 4L);
    }
}
