package com.example.filestoring.service;

import com.example.filestoring.model.User;
import com.example.filestoring.repository.UserRepository;
import com.example.filestoring.util.IdGenerator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImplementation implements UserService {

    @Autowired
    private UserRepository userRepository;

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
}
