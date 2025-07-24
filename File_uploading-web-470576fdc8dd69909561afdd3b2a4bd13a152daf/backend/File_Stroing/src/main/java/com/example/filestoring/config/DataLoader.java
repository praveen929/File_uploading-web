package com.example.filestoring.config;

import com.example.filestoring.model.User;
import com.example.filestoring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        // Create test users if database is empty
        if (userRepository.count() == 0) {
            createTestUsers();
        }
    }

    private void createTestUsers() {
        // Create Praveen Sharma (main test user)
        User praveen = new User();
        praveen.setFirstName("Praveen");
        praveen.setLastName("Sharma");
        praveen.setEmail("praveen@test.com");
        praveen.setPassword("123456");
        praveen.setGender("Male");
        praveen.setCourse("Computer Science Engineering");
        praveen.setDepartment("Computer Science");
        praveen.setBatch("2021-2025");
        praveen.setRollNumber("21CS001");
        praveen.setSemester("7");
        praveen.setPhoneNumber("+91 9876543210");
        praveen.setAddress("New Delhi, India");
        praveen.setAdmissionYear("2021");
        userRepository.save(praveen);

        // Create additional test users
        User testUser1 = new User();
        testUser1.setFirstName("John");
        testUser1.setLastName("Doe");
        testUser1.setEmail("john@test.com");
        testUser1.setPassword("123456");
        testUser1.setGender("Male");
        testUser1.setCourse("Information Technology");
        testUser1.setDepartment("IT");
        testUser1.setBatch("2020-2024");
        testUser1.setRollNumber("20IT001");
        testUser1.setSemester("8");
        testUser1.setPhoneNumber("+91 9876543211");
        testUser1.setAddress("Mumbai, India");
        testUser1.setAdmissionYear("2020");
        userRepository.save(testUser1);

        User testUser2 = new User();
        testUser2.setFirstName("Jane");
        testUser2.setLastName("Smith");
        testUser2.setEmail("jane@test.com");
        testUser2.setPassword("123456");
        testUser2.setGender("Female");
        testUser2.setCourse("Electronics & Communication");
        testUser2.setDepartment("ECE");
        testUser2.setBatch("2022-2026");
        testUser2.setRollNumber("22EC001");
        testUser2.setSemester("5");
        testUser2.setPhoneNumber("+91 9876543212");
        testUser2.setAddress("Bangalore, India");
        testUser2.setAdmissionYear("2022");
        userRepository.save(testUser2);

        System.out.println("✅ Test users created successfully!");
        System.out.println("📧 Login credentials:");
        System.out.println("   Email: praveen@test.com | Password: 123456");
        System.out.println("   Email: john@test.com    | Password: 123456");
        System.out.println("   Email: jane@test.com    | Password: 123456");
    }
}
