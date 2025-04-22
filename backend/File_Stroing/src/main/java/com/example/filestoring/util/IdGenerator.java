package com.example.filestoring.util;

import java.util.Random;

/**
 * Utility class for generating 8-digit numeric IDs
 */
public class IdGenerator {
    
    private static final Random random = new Random();
    
    /**
     * Generates a random 8-digit ID
     * @return 8-digit numeric ID as a Long
     */
    public static Long generateEightDigitId() {
        // Generate a random number between 10000000 and 99999999 (8 digits)
        return 10000000L + random.nextInt(90000000);
    }
    
    /**
     * Checks if the generated ID is valid (8 digits)
     * @param id The ID to validate
     * @return true if the ID is valid, false otherwise
     */
    public static boolean isValidId(Long id) {
        if (id == null) {
            return false;
        }
        
        String idStr = id.toString();
        return idStr.length() == 8;
    }
}
