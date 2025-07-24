package com.example.filestoring.controller;

import com.example.filestoring.model.User;
import com.example.filestoring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174",
        "https://filehuub.netlify.app"
})
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
        response.put("userId", user.getId()); // Ensure ID is correctly sent
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

    // Upload profile image
    @PostMapping("/{userId}/profile-image")
    public ResponseEntity<?> uploadProfileImage(@PathVariable Long userId,
            @RequestParam("image") MultipartFile image) {
        try {
            String imagePath = userService.uploadProfileImage(userId, image);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Profile image uploaded successfully");
            response.put("imagePath", imagePath);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Get profile image
    @GetMapping("/{userId}/profile-image")
    public ResponseEntity<Resource> getProfileImage(@PathVariable Long userId) {
        try {
            System.out.println("Profile image request for user ID: " + userId);
            Resource resource = userService.getProfileImage(userId);
            System.out.println("Profile image found and returning resource");

            // Determine content type based on file extension
            String filename = resource.getFilename();
            String contentType = "image/jpeg"; // default
            if (filename != null) {
                if (filename.toLowerCase().endsWith(".png")) {
                    contentType = "image/png";
                } else if (filename.toLowerCase().endsWith(".gif")) {
                    contentType = "image/gif";
                } else if (filename.toLowerCase().endsWith(".webp")) {
                    contentType = "image/webp";
                }
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .body(resource);
        } catch (Exception e) {
            System.out.println("Profile image error for user " + userId + ": " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // Update student profile details
    @PutMapping("/{userId}/profile")
    public ResponseEntity<?> updateStudentProfile(@PathVariable Long userId,
            @RequestBody Map<String, String> profileData) {
        try {
            User updatedUser = userService.updateStudentProfile(userId, profileData);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
