package com.example.demo;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SignupController {

    record SignupRequest(String fullName, String email, String password) {}

    private final UserRepository userRepository;
    private final EncryptionService encryptionService;

    public SignupController(UserRepository userRepository, EncryptionService encryptionService) {
        this.userRepository = userRepository;
        this.encryptionService = encryptionService;
    }

    @PostMapping("/api/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        if (request.fullName() == null || request.email() == null || request.password() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Full name, email and password required"));
        }
        String encryptedEmail = encryptionService.encrypt(request.email());
        Optional<UserEntity> existing = userRepository.findByEmail(encryptedEmail);
        if (existing.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "User already exists"));
        }
        UserEntity entity = new UserEntity();
        entity.setFullName(request.fullName());
        entity.setEmail(encryptedEmail);
        entity.setPassword(encryptionService.encrypt(request.password()));
        entity.setCreatedDate(Instant.now());
        entity.setLastLoggedInDate(Instant.now());
        entity.setAdmin(false);
        userRepository.save(entity);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Welcome, " + request.fullName() + "!"));
    }
}
