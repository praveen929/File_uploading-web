package com.example.filestoring.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import com.example.filestoring.util.IdGenerator;

@Entity
@Table(name = "users")
public class User {

	@Id
	private Long id;

	private String firstName;

	private String lastName;

	private String email;

	private String password;

	private String gender;

	public User() {
		// Default constructor
	}

	@PrePersist
	protected void onCreate() {
		if (this.id == null) {
			this.id = IdGenerator.generateEightDigitId();
		}
	}

	public User(Long id, String firstName, String lastName, String email, String password, String gender) {
		super();
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.password = password;
		this.gender = gender;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}
}
