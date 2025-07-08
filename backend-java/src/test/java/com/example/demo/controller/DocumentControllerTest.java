package com.example.demo.controller;

import com.example.demo.model.DocumentEntity;
import com.example.demo.repository.DocumentRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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
}
