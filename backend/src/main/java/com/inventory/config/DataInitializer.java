package com.inventory.config;

import com.inventory.model.User;
import com.inventory.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Base64;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin@gmail.com";
        try {
            if (!userRepository.existsByEmail(adminEmail)) {
                User admin = new User();
                admin.setFirstName("Admin");
                admin.setLastName("User");
                admin.setEmail(adminEmail);
                admin.setPassword(Base64.getEncoder().encodeToString("admin123".getBytes()));
                admin.setRole("ADMIN");
                admin.setActive(true);
                userRepository.save(admin);
                System.out.println("Default admin user created: " + adminEmail + " / admin123");
            } else {
                System.out.println("Admin user already exists: " + adminEmail);
            }
        } catch (Exception e) {
            System.out.println("DataInitializer error: " + e.getMessage());
        }
    }
}
