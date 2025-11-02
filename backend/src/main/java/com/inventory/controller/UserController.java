package com.inventory.controller;

import com.inventory.model.User;
import com.inventory.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
public class UserController {

	@Autowired
	private UserService userService;

	@GetMapping("/users")
	public List<User> getAllUsers() {
		return userService.getAllUsers();
	}

	@PostMapping("/users")
	public ResponseEntity<?> createUser(@RequestBody Map<String, String> body) {
		String firstName = body.get("firstName");
		String lastName = body.get("lastName");
		String email = body.get("email");
		String password = body.get("password");
		String role = body.getOrDefault("role", "USER");

		if (email == null || password == null || firstName == null || lastName == null) {
			return ResponseEntity.badRequest().body(Map.of("message", "Missing required fields"));
		}

		if (userService.existsByEmail(email)) {
			return ResponseEntity.status(400).body(Map.of("message", "Email already in use"));
		}

		String encoded = java.util.Base64.getEncoder().encodeToString(password.getBytes());

		User user = new User();
		user.setFirstName(firstName);
		user.setLastName(lastName);
		user.setEmail(email);
		user.setPassword(encoded);
		user.setRole(role);
		user.setActive(true);
		// Force password reset on first login — admin should set temporary password or let user set theirs
		user.setForcePasswordReset(true);

		User saved = userService.save(user);
		return ResponseEntity.status(201).body(saved);
	}

	@PutMapping("/users/{id}")
	public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> body) {
		return userService.findById(id)
				.map(u -> {
					if (body.containsKey("firstName")) u.setFirstName((String) body.get("firstName"));
					if (body.containsKey("lastName")) u.setLastName((String) body.get("lastName"));
					if (body.containsKey("email")) u.setEmail((String) body.get("email"));
					if (body.containsKey("password")) {
						String pw = (String) body.get("password");
						if (pw != null && !pw.isBlank()) {
							u.setPassword(java.util.Base64.getEncoder().encodeToString(pw.getBytes()));
						}
					}
					if (body.containsKey("role")) u.setRole((String) body.get("role"));
					if (body.containsKey("active")) u.setActive((Boolean) body.get("active"));
					userService.save(u);
					return ResponseEntity.ok(u);
				})
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	@PutMapping("/users/{id}/role")
	public ResponseEntity<?> updateRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
		String role = body.get("role");
		return userService.findById(id)
				.map(u -> {
					u.setRole(role);
					userService.save(u);
					return ResponseEntity.ok(u);
				})
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	@PutMapping("/users/{id}/active")
	public ResponseEntity<?> updateActive(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
		Boolean active = body.get("active");
		return userService.findById(id)
				.map(u -> {
					u.setActive(active != null ? active : u.getActive());
					userService.save(u);
					return ResponseEntity.ok(u);
				})
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	@DeleteMapping("/users/{id}")
	public ResponseEntity<?> deleteUser(@PathVariable Long id) {
		userService.deleteById(id);
		Map<String, String> resp = new HashMap<>();
		resp.put("message", "User deleted");
		return ResponseEntity.ok(resp);
	}
}
