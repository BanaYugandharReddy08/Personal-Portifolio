package com.example.demo.controller;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.UserEntity;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.EncryptionService;

@RestController
public class LoginController {

    record LoginRequest(String email, String password) {}


    private final UserRepository userRepository;
    private final EncryptionService encryptionService;

    public LoginController(UserRepository userRepository, EncryptionService encryptionService) {
        this.userRepository = userRepository;
        this.encryptionService = encryptionService;
    }

    @PostMapping("/api/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request.email() == null || request.password() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password required"));
        }
        String encryptedEmail = encryptionService.encrypt(request.email());
        Optional<UserEntity> optional = userRepository.findByEmail(encryptedEmail);
        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        }
        UserEntity user = optional.get();
        String decryptedPassword = encryptionService.decrypt(user.getPassword());
        if (!decryptedPassword.equals(request.password())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        }
        Instant previousLogin = user.getLastLoggedInDate();
        user.setLastLoggedInDate(Instant.now());
        userRepository.save(user);
        return ResponseEntity.ok(Map.of(
            "id", user.getId(),
            "email", request.email(),
            "fullName", user.getFullName(),
            "admin", user.isAdmin(),
            "lastLogin", previousLogin != null ? previousLogin.toString() : null
        ));
    }
}
