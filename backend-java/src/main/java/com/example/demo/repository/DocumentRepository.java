package com.example.demo.repository;

import com.example.demo.model.DocumentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DocumentRepository extends JpaRepository<DocumentEntity, Long> {

    @Query(value = "SELECT * FROM documents WHERE type = :type ORDER BY uploaded_at DESC LIMIT 1",
           nativeQuery = true)
    DocumentEntity findTopByTypeOrderByUploadedAtDesc(@Param("type") String type);
}
