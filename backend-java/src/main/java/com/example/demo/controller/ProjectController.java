package com.example.demo.controller;

import com.example.demo.model.ProjectEntity;
import com.example.demo.repository.ProjectRepository;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectRepository projectRepository;
    private final Path reportDir = Paths.get("uploads/projects");

    public ProjectController(ProjectRepository projectRepository) throws IOException {
        this.projectRepository = projectRepository;
        Files.createDirectories(reportDir);
    }

    @GetMapping
    public List<ProjectEntity> getAll() {
        return projectRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<ProjectEntity> create(@RequestBody ProjectEntity project) {
        ProjectEntity saved = projectRepository.save(project);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectEntity> update(@PathVariable("id") Long id, @RequestBody ProjectEntity project) {
        Optional<ProjectEntity> existingOpt = projectRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        ProjectEntity existing = existingOpt.get();
        existing.setTitle(project.getTitle());
        existing.setDescription(project.getDescription());
        existing.setImageUrl(project.getImageUrl());
        existing.setTechnologies(project.getTechnologies());
        existing.setReportFile(project.getReportFile());
        ProjectEntity saved = projectRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @PostMapping(path = "/{id}/report", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadReport(@PathVariable("id") Long id, @RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "File required"));
        }
        Optional<ProjectEntity> opt = projectRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        try {
            String original = file.getOriginalFilename();
            String ext = "";
            if (original != null && original.contains(".")) {
                ext = original.substring(original.lastIndexOf('.'));
            }
            String storedName = "report-" + id + "-" + System.currentTimeMillis() + ext;
            Path target = reportDir.resolve(storedName);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            ProjectEntity project = opt.get();
            project.setReportFile(storedName);
            projectRepository.save(project);
            return ResponseEntity.ok(Map.of("fileName", storedName));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to store file"));
        }
    }

    @GetMapping("/{id}/report")
    public ResponseEntity<?> fetchReport(@PathVariable("id") Long id) {
        Optional<ProjectEntity> opt = projectRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String fileName = opt.get().getReportFile();
        if (fileName == null || fileName.isBlank()) {
            return ResponseEntity.notFound().build();
        }
        Path filePath = reportDir.resolve(fileName);
        if (!Files.exists(filePath)) {
            return ResponseEntity.notFound().build();
        }
        FileSystemResource resource = new FileSystemResource(filePath);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName)
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        if (!projectRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        projectRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
