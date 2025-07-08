package com.example.demo.controller;

import com.example.demo.model.ProjectEntity;
import com.example.demo.repository.ProjectRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectRepository projectRepository;

    public ProjectController(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
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
        ProjectEntity saved = projectRepository.save(existing);
        return ResponseEntity.ok(saved);
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
