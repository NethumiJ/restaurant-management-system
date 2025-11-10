package com.inventory.service;

import com.inventory.dto.AuthResponse;
import com.inventory.dto.SignInRequest;
import com.inventory.dto.SignUpRequest;
import com.inventory.model.User;
import com.inventory.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public AuthResponse signUp(SignUpRequest request) {
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        // Create new user
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        // In production, use BCrypt to hash password
        user.setPassword(encodePassword(request.getPassword()));
<<<<<<< HEAD
        user.setRole("USER");
=======
        // Validate and set role (CHEF, CASHIER, MANAGER, or ADMIN)
        String role = request.getRole();
        if (role == null || (!role.equals("CHEF") && !role.equals("CASHIER") && !role.equals("MANAGER") && !role.equals("ADMIN"))) {
            role = "CASHIER"; // Default to CASHIER if invalid
        }
        user.setRole(role);
>>>>>>> backend
        user.setActive(true);

        User savedUser = userRepository.save(user);

        // Generate simple token (in production, use JWT)
        String token = generateToken(savedUser);

        return new AuthResponse(
            savedUser.getId(),
            savedUser.getEmail(),
            savedUser.getFirstName(),
            savedUser.getLastName(),
            savedUser.getRole(),
            token
        );
    }

    public AuthResponse signIn(SignInRequest request) {
        // Find user by email
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        
        if (userOptional.isEmpty()) {
            throw new RuntimeException("Invalid email or password");
        }

        User user = userOptional.get();

        // Verify password
        if (!verifyPassword(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        if (!user.getActive()) {
            throw new RuntimeException("Account is disabled");
        }

        // If user must change password on first login, return special response
        if (user.getForcePasswordReset() != null && user.getForcePasswordReset()) {
            AuthResponse resp = new AuthResponse("RESET_REQUIRED");
            resp.setId(user.getId());
            resp.setEmail(user.getEmail());
            resp.setFirstName(user.getFirstName());
            resp.setLastName(user.getLastName());
            resp.setRole(user.getRole());
            return resp;
        }

        // Generate token
        String token = generateToken(user);

        return new AuthResponse(
            user.getId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getRole(),
            token
        );
    }

    public String requestPasswordReset(String email) {
        Optional<User> uOpt = userRepository.findByEmail(email);
        if (uOpt.isEmpty()) throw new RuntimeException("No user with that email");
        User u = uOpt.get();
        String token = java.util.UUID.randomUUID().toString();
        u.setResetToken(token);
        u.setResetTokenExpiry(java.time.LocalDateTime.now().plusHours(1));
        userRepository.save(u);
        return token;
    }

    public void resetPassword(String token, String newPassword) {
        Optional<User> uOpt = userRepository.findByResetToken(token);
        if (uOpt.isEmpty()) throw new RuntimeException("Invalid or expired token");
        User u = uOpt.get();
        if (u.getResetTokenExpiry() == null || u.getResetTokenExpiry().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("Invalid or expired token");
        }
        u.setPassword(encodePassword(newPassword));
        u.setResetToken(null);
        u.setResetTokenExpiry(null);
        u.setForcePasswordReset(false);
        userRepository.save(u);
    }

    public void completeFirstLogin(Long userId, String newPassword) {
        Optional<User> uOpt = userRepository.findById(userId);
        if (uOpt.isEmpty()) throw new RuntimeException("User not found");
        User u = uOpt.get();
        if (u.getForcePasswordReset() == null || !u.getForcePasswordReset()) {
            throw new RuntimeException("Password change not required");
        }
        u.setPassword(encodePassword(newPassword));
        u.setForcePasswordReset(false);
        userRepository.save(u);
    }

    private String encodePassword(String password) {
        // Simple Base64 encoding for demo (USE BCRYPT IN PRODUCTION!)
        return Base64.getEncoder().encodeToString(password.getBytes());
    }

    private boolean verifyPassword(String rawPassword, String encodedPassword) {
        String encoded = encodePassword(rawPassword);
        return encoded.equals(encodedPassword);
    }

    private String generateToken(User user) {
        // Simple token generation (USE JWT IN PRODUCTION!)
        String data = user.getId() + ":" + user.getEmail() + ":" + System.currentTimeMillis();
        return Base64.getEncoder().encodeToString(data.getBytes());
    }
}
