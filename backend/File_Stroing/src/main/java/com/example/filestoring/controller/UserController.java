package com.example.filestoring.controller;

import com.example.filestoring.model.User;
import com.example.filestoring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "https://filehuub.netlify.app/") // Allow React frontend
@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Home endpoint
    @GetMapping("/")
    public String home() {
        return "This is home";
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> requestData) {
        String email = requestData.get("email");
        String password = requestData.get("password");

        User user = userService.findUserByEmail(email);

        if (user == null || !user.getPassword().equals(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        // Return only required fields
        Map<String, Object> response = new HashMap<>();
        response.put("userId", user.getId());  // Ensure ID is correctly sent
        response.put("email", user.getEmail());

        return ResponseEntity.ok(response);
    }

    // Fetch all users
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        // Check if user already exists by email
        if (userService.existsByEmail(user.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "User already exists"));
        }

        User savedUser = userService.registerUser(user);

        if (savedUser == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User registration failed");
        }

        // Return only necessary data
        Map<String, Object> response = new HashMap<>();
        response.put("userId", savedUser.getId());
        response.put("email", savedUser.getEmail());

        return ResponseEntity.ok(response);
    }

    // Find user by ID
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) throws Exception {
        return userService.findUserById(id);
    }

    // Find user by email
    @GetMapping("/email/{email}")
    public User getUserByEmail(@PathVariable String email) {
        return userService.findUserByEmail(email);
    }

    // Update user details
    @PutMapping("/{id}")
    public User updateUser(@RequestBody User user, @PathVariable Long id) throws Exception {
        return userService.updateUser(user, id);
    }

    // Search users by name or email
    @GetMapping("/search")
    public List<User> searchUsers(@RequestParam String query) {
        return userService.serachUser(query);
    }
}
