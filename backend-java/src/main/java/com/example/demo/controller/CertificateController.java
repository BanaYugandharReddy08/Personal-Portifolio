package com.example.demo.controller;

import com.example.demo.model.CertificateEntity;
import com.example.demo.model.ModuleEntity;
import com.example.demo.repository.CertificateRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    private final CertificateRepository certificateRepository;

    public CertificateController(CertificateRepository certificateRepository) {
        this.certificateRepository = certificateRepository;
    }

    @GetMapping
    public List<CertificateEntity> getAll() {
        return certificateRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<CertificateEntity> create(@RequestBody CertificateEntity certificate) {
        setModuleParent(certificate);
        CertificateEntity saved = certificateRepository.save(certificate);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CertificateEntity> update(@PathVariable("id") Long id, @RequestBody CertificateEntity certificate) {
        Optional<CertificateEntity> existingOpt = certificateRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        CertificateEntity existing = existingOpt.get();
        existing.setTitle(certificate.getTitle());
        existing.setIssuer(certificate.getIssuer());
        existing.setDate(certificate.getDate());
        existing.setCategory(certificate.getCategory());
        existing.setImageUrl(certificate.getImageUrl());
        existing.setTakeaway(certificate.getTakeaway());
        existing.setStatus(certificate.getStatus());
        existing.setModules(certificate.getModules());
        CertificateEntity saved = certificateRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        if (!certificateRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        certificateRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private void setModuleParent(CertificateEntity certificate) {
        if (certificate.getModules() != null) {
            for (ModuleEntity module : certificate.getModules()) {
                module.setCertificate(certificate);
            }
        }
    }
}
