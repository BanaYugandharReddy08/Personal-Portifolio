package com.example.demo;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

    record SignupRequest(String fullName, String email, String password) {}
    record LoginRequest(String email, String password) {}

    static class User {
        String fullName;
        String email;
        String password;
        Instant lastLogin;
        User(String fullName, String email, String password) {
            this.fullName = fullName;
            this.email = email;
            this.password = password;
        }
    }

    private static final Map<String, User> USERS = new ConcurrentHashMap<>();
    static {
        USERS.put("admin@test.com", new User("Admin", "admin@test.com", "admin123"));
        USERS.put("guest@example.com", new User("Guest", "guest@example.com", "guest123"));
    }

    @PostMapping("/api/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        if (request.fullName() == null || request.email() == null || request.password() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Full name, email and password required"));
        }
        if (USERS.containsKey(request.email())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "User already exists"));
        }
        USERS.put(request.email(), new User(request.fullName(), request.email(), request.password()));
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Welcome, " + request.fullName() + "!"));
    }

    @PostMapping("/api/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request.email() == null || request.password() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password required"));
        }
        User user = USERS.get(request.email());
        if (user == null || !user.password.equals(request.password())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        }
        Instant previousLogin = user.lastLogin;
        user.lastLogin = Instant.now();
        return ResponseEntity.ok(Map.of("lastLogin", previousLogin != null ? previousLogin.toString() : null));
    }
}
