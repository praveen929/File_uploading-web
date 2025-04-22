package com.example.filestoring.service;

import java.util.List;
import com.example.filestoring.model.User;

public interface UserService {
	
	public User registerUser(User user);
	
	public User findUserById(Long userId) throws Exception;
		
	public User findUserByEmail(String email);
	
	public User updateUser(User user, Long userId) throws Exception;
	
	public List<User> serachUser(String query);

	public List<User> getAllUsers();
	
	User loginUser(String email, String password) throws Exception;

	public boolean existsByEmail(String email);
}
