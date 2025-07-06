package com.example.demo;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {

    record LoginRequest(String email, String password) {}
    record User(String email, String password) {}

    private static final List<User> USERS = List.of(
            new User("admin@test.com", "admin123"),
            new User("guest@example.com", "guest123")
    );

    @PostMapping("/api/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request.email() == null || request.password() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password required"));
        }
        boolean matched = USERS.stream()
                .anyMatch(u -> u.email().equals(request.email()) && u.password().equals(request.password()));
        if (!matched) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials"));
        }
        return ResponseEntity.ok(
                Map.of(
                        "message", "login successful",
                        "user", Map.of("email", request.email())
                )
        );
    }
}
