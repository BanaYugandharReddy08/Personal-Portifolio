package com.example.demo.controller;

import com.example.demo.model.DocumentEntity;
import com.example.demo.repository.DocumentRepository;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DocumentController.class)
class DocumentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DocumentRepository documentRepository;

    @Test
    void getAllDocumentsReturnsList() throws Exception {
        DocumentEntity doc = new DocumentEntity();
        doc.setId(1L);
        doc.setType("resume");
        doc.setFileName("file.pdf");
        doc.setUploadedAt(Instant.now());
        when(documentRepository.findAll()).thenReturn(List.of(doc));

        mockMvc.perform(get("/api/documents"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].type").value("resume"))
                .andExpect(jsonPath("$[0].fileName").value("file.pdf"));
    }

    @Test
    void uploadDocumentStoresFile() throws Exception {
        MockMultipartFile multipartFile = new MockMultipartFile(
                "file", "resume.pdf", "application/pdf", "data".getBytes());

        when(documentRepository.save(any(DocumentEntity.class))).thenAnswer(inv -> inv.getArgument(0));

        mockMvc.perform(multipart("/api/documents/resume").file(multipartFile))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fileName").exists());

        ArgumentCaptor<DocumentEntity> captor = ArgumentCaptor.forClass(DocumentEntity.class);
        verify(documentRepository).save(captor.capture());
        DocumentEntity saved = captor.getValue();

        assertThat(saved.getType()).isEqualTo("resume");
        String storedFile = saved.getFileName();
        assertThat(storedFile).startsWith("resume-");
        assertThat(storedFile).endsWith(".pdf");

        Path path = Path.of("uploads", storedFile);
        assertThat(Files.exists(path)).isTrue();

        Files.deleteIfExists(path);
    }

    @Test
    void getLatestDocumentReturnsFile() throws Exception {
        String fileName = "resume-test.pdf";
        Path uploadDir = Path.of("uploads");
        Files.createDirectories(uploadDir);
        Path filePath = uploadDir.resolve(fileName);
        Files.writeString(filePath, "content");

        DocumentEntity entity = new DocumentEntity();
        entity.setType("resume");
        entity.setFileName(fileName);
        entity.setUploadedAt(Instant.now());

        when(documentRepository.findTopByTypeOrderByUploadedAtDesc("resume"))
                .thenReturn(entity);

        mockMvc.perform(get("/api/documents/resume"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=" + fileName))
                .andExpect(content().string("content"));

        Files.deleteIfExists(filePath);
    }
}
