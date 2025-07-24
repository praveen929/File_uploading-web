package com.example.filestoring.service;

import com.example.filestoring.model.User;
import com.example.filestoring.repository.UserRepository;
import com.example.filestoring.util.IdGenerator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class UserServiceImplementation implements UserService {

    @Autowired
    private UserRepository userRepository;

    private static final Path PROFILE_IMAGES_DIR = Paths.get("profile-images");

    @Override
    public User registerUser(User user) {
        User newUser = new User();

        newUser.setEmail(user.getEmail());
        newUser.setFirstName(user.getFirstName());
        newUser.setLastName(user.getLastName());
        newUser.setPassword(user.getPassword());
        newUser.setGender(user.getGender());

        // If user provided an ID, validate it's an 8-digit ID
        if (user.getId() != null) {
            if (IdGenerator.isValidId(user.getId())) {
                newUser.setId(user.getId());
            } else {
                // Generate a new 8-digit ID if the provided ID is invalid
                newUser.setId(IdGenerator.generateEightDigitId());
            }
        }
        // If no ID provided, the @PrePersist in User entity will generate one

        return userRepository.save(newUser);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public User findUserById(Long userId) throws Exception {
        return userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found with this Id " + userId));
    }

    @Override
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public User updateUser(User user, Long userId) throws Exception {
        User oldUser = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User does not exist with this ID " + userId));

        if (user.getFirstName() != null)
            oldUser.setFirstName(user.getFirstName());
        if (user.getLastName() != null)
            oldUser.setLastName(user.getLastName());
        if (user.getEmail() != null)
            oldUser.setEmail(user.getEmail());
        if (user.getGender() != null)
            oldUser.setGender(user.getGender());
        if (user.getPassword() != null)
            oldUser.setPassword(user.getPassword());

        return userRepository.save(oldUser);
    }

    @Override
    public List<User> serachUser(String query) {
        return userRepository.searchUser(query);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User loginUser(String email, String password) throws Exception {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new Exception("User not found with email: " + email);
        }

        if (!user.getPassword().equals(password)) {
            throw new Exception("Invalid password!");
        }

        return user;
    }

    @Override
    public String uploadProfileImage(Long userId, MultipartFile image) throws Exception {
        User user = findUserById(userId);

        // Create profile-images directory if it doesn't exist
        Files.createDirectories(PROFILE_IMAGES_DIR);

        // Generate unique filename
        String originalFileName = image.getOriginalFilename();
        if (originalFileName == null) {
            originalFileName = "profile_image.jpg";
        }
        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf('.'));
        String uniqueFileName = userId + "_" + UUID.randomUUID().toString() + fileExtension;

        // Save file
        Path filePath = PROFILE_IMAGES_DIR.resolve(uniqueFileName);
        Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Update user profile image path
        user.setProfileImagePath(uniqueFileName);
        userRepository.save(user);

        return uniqueFileName;
    }

    @Override
    public Resource getProfileImage(Long userId) throws Exception {
        User user = findUserById(userId);

        System.out.println("Getting profile image for user ID: " + userId);
        System.out.println("User profile image path: " + user.getProfileImagePath());

        if (user.getProfileImagePath() == null) {
            System.out.println("No profile image path found for user " + userId);
            throw new Exception("No profile image found for user");
        }

        Path imagePath = PROFILE_IMAGES_DIR.resolve(user.getProfileImagePath()).normalize();
        Resource resource = new UrlResource(imagePath.toUri());

        if (resource.exists() && resource.isReadable()) {
            return resource;
        } else {
            throw new Exception("Profile image not found or not readable");
        }
    }

    @Override
    public User updateStudentProfile(Long userId, Map<String, String> profileData) throws Exception {
        User user = findUserById(userId);

        // Update student profile fields
        if (profileData.containsKey("course")) {
            user.setCourse(profileData.get("course"));
        }
        if (profileData.containsKey("batch")) {
            user.setBatch(profileData.get("batch"));
        }
        if (profileData.containsKey("rollNumber")) {
            user.setRollNumber(profileData.get("rollNumber"));
        }
        if (profileData.containsKey("department")) {
            user.setDepartment(profileData.get("department"));
        }
        if (profileData.containsKey("semester")) {
            user.setSemester(profileData.get("semester"));
        }
        if (profileData.containsKey("phoneNumber")) {
            user.setPhoneNumber(profileData.get("phoneNumber"));
        }
        if (profileData.containsKey("address")) {
            user.setAddress(profileData.get("address"));
        }
        if (profileData.containsKey("dateOfBirth")) {
            user.setDateOfBirth(profileData.get("dateOfBirth"));
        }
        if (profileData.containsKey("admissionYear")) {
            user.setAdmissionYear(profileData.get("admissionYear"));
        }

        // Update basic profile fields too
        if (profileData.containsKey("firstName")) {
            user.setFirstName(profileData.get("firstName"));
        }
        if (profileData.containsKey("lastName")) {
            user.setLastName(profileData.get("lastName"));
        }
        if (profileData.containsKey("email")) {
            user.setEmail(profileData.get("email"));
        }
        if (profileData.containsKey("gender")) {
            user.setGender(profileData.get("gender"));
        }

        return userRepository.save(user);
    }
}
