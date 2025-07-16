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
import com.example.demo.service.AnalyticsService;

@RestController
public class LoginController {

    record LoginRequest(String email, String password) {}

    private static final String GUEST_EMAIL = "guest@example.com";
    private static final String GUEST_PASSWORD = "guest123";


    private final UserRepository userRepository;
    private final EncryptionService encryptionService;
    private final AnalyticsService analyticsService;

    public LoginController(UserRepository userRepository, EncryptionService encryptionService, AnalyticsService analyticsService) {
        this.userRepository = userRepository;
        this.encryptionService = encryptionService;
        this.analyticsService = analyticsService;
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
        if (GUEST_EMAIL.equalsIgnoreCase(request.email()) && GUEST_PASSWORD.equals(request.password())) {
            analyticsService.recordEvent(AnalyticsService.EVENT_GUEST_LOGIN);
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
