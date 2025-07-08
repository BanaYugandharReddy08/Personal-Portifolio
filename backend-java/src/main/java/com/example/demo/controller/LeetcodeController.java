package com.example.demo.controller;

import com.example.demo.model.ProblemEntity;
import com.example.demo.repository.ProblemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/leetcode")
public class LeetcodeController {

    private final ProblemRepository problemRepository;

    public LeetcodeController(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    @GetMapping
    public List<ProblemEntity> getAll() {
        return problemRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<ProblemEntity> create(@RequestBody ProblemEntity problem) {
        ProblemEntity saved = problemRepository.save(problem);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProblemEntity> update(@PathVariable("id") Long id, @RequestBody ProblemEntity problem) {
        Optional<ProblemEntity> existingOpt = problemRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        ProblemEntity existing = existingOpt.get();
        existing.setLcId(problem.getLcId());
        existing.setTitle(problem.getTitle());
        existing.setDifficulty(problem.getDifficulty());
        existing.setLink(problem.getLink());
        existing.setStatement(problem.getStatement());
        existing.setSolution(problem.getSolution());
        ProblemEntity saved = problemRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        if (!problemRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        problemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
