package com.example.demo.controller;

import com.example.demo.model.ExperienceEntity;
import com.example.demo.repository.ExperienceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/experiences")
public class ExperienceController {

    @Autowired
    private ExperienceRepository experienceRepository;

    @GetMapping
    public List<ExperienceEntity> getAll() {
        return experienceRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<ExperienceEntity> create(@RequestBody ExperienceEntity experience) {
        ExperienceEntity saved = experienceRepository.save(experience);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExperienceEntity> update(@PathVariable Long id, @RequestBody ExperienceEntity experience) {
        Optional<ExperienceEntity> existingOpt = experienceRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        ExperienceEntity existing = existingOpt.get();
        existing.setPosition(experience.getPosition());
        existing.setCompany(experience.getCompany());
        existing.setDescription(experience.getDescription());
        existing.setStartDate(experience.getStartDate());
        existing.setEndDate(experience.getEndDate());
        existing.setCurrentlyWorking(experience.isCurrentlyWorking());
        existing.setSkills(experience.getSkills());
        ExperienceEntity saved = experienceRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!experienceRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        experienceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
