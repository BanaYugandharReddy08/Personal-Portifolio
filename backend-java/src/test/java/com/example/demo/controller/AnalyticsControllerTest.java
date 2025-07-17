package com.example.demo.controller;

import com.example.demo.model.AnalyticsEventEntity.EventType;
import com.example.demo.service.AnalyticsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AnalyticsController.class)
class AnalyticsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AnalyticsService analyticsService;

    @Test
    void getAnalyticsReturnsCounts() throws Exception {
        when(analyticsService.countEvents(EventType.GUEST_LOGIN, null, null)).thenReturn(1L);
        when(analyticsService.countEvents(EventType.USER_SIGNUP, null, null)).thenReturn(2L);
        when(analyticsService.countEvents(EventType.CV_DOWNLOAD, null, null)).thenReturn(3L);
        when(analyticsService.countEvents(EventType.COVERLETTER_DOWNLOAD, null, null)).thenReturn(4L);

        mockMvc.perform(get("/api/analytics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.guestLogins").value(1L))
                .andExpect(jsonPath("$.signups").value(2L))
                .andExpect(jsonPath("$.cvDownloads").value(3L))
                .andExpect(jsonPath("$.coverletterDownloads").value(4L));
    }

    @Test
    void getAnalyticsWithRangePassesDates() throws Exception {
        Instant start = Instant.parse("2024-01-01T00:00:00Z");
        Instant end = Instant.parse("2024-01-02T00:00:00Z");
        when(analyticsService.countEvents(any(), any(), any())).thenReturn(0L);

        mockMvc.perform(get("/api/analytics")
                        .param("start", start.toString())
                        .param("end", end.toString()))
                .andExpect(status().isOk());

        verify(analyticsService).countEvents(EventType.GUEST_LOGIN, start, end);
        verify(analyticsService).countEvents(EventType.USER_SIGNUP, start, end);
        verify(analyticsService).countEvents(EventType.CV_DOWNLOAD, start, end);
        verify(analyticsService).countEvents(EventType.COVERLETTER_DOWNLOAD, start, end);
    }

    @Test
    void recordGuestLoginCallsService() throws Exception {
        mockMvc.perform(post("/api/analytics/guest-login"))
                .andExpect(status().isOk());

        verify(analyticsService).recordEvent(AnalyticsService.EVENT_GUEST_LOGIN);
    }
}
