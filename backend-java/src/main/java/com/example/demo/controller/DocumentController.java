package com.example.demo.controller;

import com.example.demo.model.DocumentEntity;
import com.example.demo.repository.DocumentRepository;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentRepository documentRepository;
    private final Path uploadDir = Paths.get("uploads");

    public DocumentController(DocumentRepository documentRepository) throws IOException {
        this.documentRepository = documentRepository;
        Files.createDirectories(uploadDir);
    }

    @PostMapping(path = "/{type}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> upload(@PathVariable("type") String type, @RequestParam("file") MultipartFile file) {
        if (!"resume".equalsIgnoreCase(type) && !"coverletter".equalsIgnoreCase(type)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid type"));
        }
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "File required"));
        }
        try {
            String original = file.getOriginalFilename();
            String ext = "";
            if (original != null && original.contains(".")) {
                ext = original.substring(original.lastIndexOf('.'));
            }
            String storedName = type + "-" + System.currentTimeMillis() + ext;
            Path target = uploadDir.resolve(storedName);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            DocumentEntity entity = new DocumentEntity();
            entity.setType(type.toLowerCase());
            entity.setFileName(storedName);
            entity.setUploadedAt(Instant.now());
            documentRepository.save(entity);
            return ResponseEntity.ok(Map.of("fileName", storedName));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to store file"));
        }
    }

    @GetMapping(path = "/{type}")
    public ResponseEntity<?> fetchLatest(@PathVariable("type") String type) {
        if (!"resume".equalsIgnoreCase(type) && !"coverletter".equalsIgnoreCase(type)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid type"));
        }
        DocumentEntity entity = documentRepository.findTopByTypeOrderByUploadedAtDesc(type.toLowerCase());
        if (entity == null) {
            return ResponseEntity.notFound().build();
        }
        Path filePath = uploadDir.resolve(entity.getFileName());
        if (!Files.exists(filePath)) {
            return ResponseEntity.notFound().build();
        }
        FileSystemResource resource = new FileSystemResource(filePath);
        String contentType;
        try {
            contentType = Files.probeContentType(filePath);
        } catch (IOException e) {
            contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + entity.getFileName())
                .contentType(MediaType.parseMediaType(contentType != null ? contentType : MediaType.APPLICATION_OCTET_STREAM_VALUE))
                .body(resource);
    }
}
