package com.example.demo.repository;

import com.example.demo.model.DocumentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentRepository extends JpaRepository<DocumentEntity, Long> {
    DocumentEntity findTopByTypeOrderByUploadedAtDesc(String type);
}
