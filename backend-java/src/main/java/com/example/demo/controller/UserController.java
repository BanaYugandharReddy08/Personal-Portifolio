package com.example.demo.controller;

import com.example.demo.model.UserEntity;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.EncryptionService;

import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final EncryptionService encryptionService;
    private final Path uploadDir = Paths.get("uploads");

    public UserController(UserRepository userRepository, EncryptionService encryptionService) throws IOException {
        this.userRepository = userRepository;
        this.encryptionService = encryptionService;
        Files.createDirectories(uploadDir);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable("id") Long id) {
        Optional<UserEntity> opt = userRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        UserEntity user = opt.get();
        String email = encryptionService.decrypt(user.getEmail());
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "fullName", user.getFullName(),
                "email", email,
                "profilePicture", user.getProfilePicture()
        ));
    }

    record UpdateUserRequest(String fullName, String email, String password) {}

    @PutMapping(path = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateUser(@PathVariable("id") Long id, @RequestBody UpdateUserRequest request) {
        Optional<UserEntity> opt = userRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        UserEntity user = opt.get();
        if (request.fullName() != null) {
            user.setFullName(request.fullName());
        }
        if (request.email() != null) {
            user.setEmail(encryptionService.encrypt(request.email()));
        }
        if (request.password() != null) {
            user.setPassword(encryptionService.encrypt(request.password()));
        }
        userRepository.save(user);
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "fullName", user.getFullName(),
                "email", request.email() != null ? request.email() : encryptionService.decrypt(user.getEmail()),
                "profilePicture", user.getProfilePicture()
        ));
    }

    @PostMapping(path = "/{id}/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadPhoto(@PathVariable("id") Long id, @RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "File required"));
        }
        Optional<UserEntity> opt = userRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        try {
            String original = file.getOriginalFilename();
            String ext = "";
            if (original != null && original.contains(".")) {
                ext = original.substring(original.lastIndexOf('.'));
            }
            String storedName = "profile-" + id + "-" + System.currentTimeMillis() + ext;
            Path target = uploadDir.resolve(storedName);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            UserEntity user = opt.get();
            user.setProfilePicture(storedName);
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("fileName", storedName));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to store file"));
        }
    }

    @GetMapping(path = "/{id}/photo")
    public ResponseEntity<?> fetchPhoto(@PathVariable("id") Long id) {
        Optional<UserEntity> opt = userRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String fileName = opt.get().getProfilePicture();
        if (fileName == null) {
            return ResponseEntity.notFound().build();
        }
        Path filePath = uploadDir.resolve(fileName);
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
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName)
                .contentType(MediaType.parseMediaType(contentType != null ? contentType : MediaType.APPLICATION_OCTET_STREAM_VALUE))
                .body(resource);
    }
}
