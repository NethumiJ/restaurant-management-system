package com.inventory.controller;

import com.inventory.dto.AuthResponse;
import com.inventory.dto.SignInRequest;
import com.inventory.dto.SignUpRequest;
import com.inventory.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@Valid @RequestBody SignUpRequest request) {
        try {
            AuthResponse response = authService.signUp(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new AuthResponse(e.getMessage()));
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signIn(@Valid @RequestBody SignInRequest request) {
        try {
            AuthResponse response = authService.signIn(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new AuthResponse(e.getMessage()));
        }
    }

    @PostMapping("/signout")
    public ResponseEntity<?> signOut() {
        // In a real application with JWT, you might invalidate the token here
        return ResponseEntity.ok(new AuthResponse("Successfully signed out"));
    }

    @PostMapping("/request-password-reset")
    public ResponseEntity<?> requestPasswordReset(@RequestBody java.util.Map<String, String> body) {
        String email = body.get("email");
        if (email == null) return ResponseEntity.badRequest().body(new AuthResponse("Email required"));
        try {
            String token = authService.requestPasswordReset(email);
            // In production you'd email the token; here we return it for demo purposes
            return ResponseEntity.ok(java.util.Map.of("token", token));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new AuthResponse(e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody java.util.Map<String, String> body) {
        String token = body.get("token");
        String password = body.get("password");
        if (token == null || password == null) return ResponseEntity.badRequest().body(new AuthResponse("Token and password required"));
        try {
            authService.resetPassword(token, password);
            return ResponseEntity.ok(new AuthResponse("Password reset successful"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new AuthResponse(e.getMessage()));
        }
    }

    @PostMapping("/complete-first-login")
    public ResponseEntity<?> completeFirstLogin(@RequestBody java.util.Map<String, String> body) {
        String idStr = body.get("userId");
        String password = body.get("password");
        if (idStr == null || password == null) return ResponseEntity.badRequest().body(new AuthResponse("userId and password required"));
        try {
            Long id = Long.parseLong(idStr);
            authService.completeFirstLogin(id, password);
            return ResponseEntity.ok(new AuthResponse("Password updated"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new AuthResponse(e.getMessage()));
        }
    }
}

