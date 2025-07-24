package com.example.filestoring.util;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class IdGeneratorTest {

    @Test
    public void testGenerateEightDigitId() {
        // Generate 100 IDs and verify they are all 8 digits
        for (int i = 0; i < 100; i++) {
            Long id = IdGenerator.generateEightDigitId();
            
            // Convert to string to check length
            String idStr = id.toString();
            
            // Verify it's 8 digits
            assertEquals(8, idStr.length(), "ID should be 8 digits long");
            
            // Verify it's a valid ID according to our validator
            assertTrue(IdGenerator.isValidId(id), "ID should be valid");
        }
    }
    
    @Test
    public void testIsValidId() {
        // Test valid IDs
        assertTrue(IdGenerator.isValidId(12345678L), "8-digit ID should be valid");
        
        // Test invalid IDs
        assertFalse(IdGenerator.isValidId(1234567L), "7-digit ID should be invalid");
        assertFalse(IdGenerator.isValidId(123456789L), "9-digit ID should be invalid");
        assertFalse(IdGenerator.isValidId(null), "Null ID should be invalid");
    }
}
