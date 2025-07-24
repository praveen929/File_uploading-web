package com.example.filestoring.service;

import java.util.List;
import java.util.Map;
import com.example.filestoring.model.User;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {

	public User registerUser(User user);

	public User findUserById(Long userId) throws Exception;

	public User findUserByEmail(String email);

	public User updateUser(User user, Long userId) throws Exception;

	public List<User> serachUser(String query);

	public List<User> getAllUsers();

	User loginUser(String email, String password) throws Exception;

	public boolean existsByEmail(String email);

	// Student profile methods
	public String uploadProfileImage(Long userId, MultipartFile image) throws Exception;

	public Resource getProfileImage(Long userId) throws Exception;

	public User updateStudentProfile(Long userId, Map<String, String> profileData) throws Exception;
}
