/**
 * Authentication utilities for the application
 */
import { getCookie, setCookie, removeCookie, hasCookie } from "./cookies";

// Constants
export const USER_ID_COOKIE = "userId";
export const AUTH_COOKIE_DAYS = 7;

/**
 * Check if the user is authenticated
 * @returns {boolean} - Whether the user is authenticated
 */
export const isAuthenticated = () => {
  const userId = getCookie(USER_ID_COOKIE);
  return Boolean(userId) && userId !== "undefined";
};

/**
 * Get the current user ID from cookies
 * @returns {string|null} - The user ID or null if not authenticated
 */
export const getCurrentUserId = () => {
  const userId = getCookie(USER_ID_COOKIE);

  // Check if userId is undefined, null, empty string, or the string 'undefined'
  if (!userId || userId === "undefined") {
    return null;
  }

  return userId;
};

/**
 * Set the user ID in cookies (login)
 * @param {string} userId - The user ID to set
 * @param {number} days - Number of days until the cookie expires
 * @returns {boolean} - Whether the user ID was set successfully
 */
export const setCurrentUserId = (userId, days = AUTH_COOKIE_DAYS) => {
  if (!userId) {
    console.error("Cannot set user ID: value is invalid");
    return false;
  }

  return setCookie(USER_ID_COOKIE, userId, days);
};

/**
 * Remove the user ID from cookies (logout)
 * @returns {boolean} - Whether the user ID was removed successfully
 */
export const clearCurrentUserId = () => {
  return removeCookie(USER_ID_COOKIE);
};

/**
 * Fetch the current user's data from the API
 * @returns {Promise<Object|null>} - The user data or null if not authenticated or error
 */
export const fetchCurrentUser = async () => {
  const userId = getCurrentUserId();

  // Early return with null if userId is undefined, null, or empty string
  if (!userId || userId === "undefined") {
    console.log("No valid user ID found, skipping user data fetch");
    return null;
  }

  try {
    console.log(`Fetching user data for ID: ${userId}`);
    const response = await fetch(`http://localhost:8080/users/${userId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.status}`);
    }

    const userData = await response.json();
    console.log("User data fetched successfully");
    return userData;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};

/**
 * Login a user with email and password
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>} - The result of the login attempt
 */
export const loginUser = async (email, password) => {
  try {
    console.log(`Attempting login for email: ${email}`);

    const response = await fetch("http://localhost:8080/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("Login response:", data);

    if (!response.ok) {
      console.error("Login failed with status:", response.status);
      return {
        success: false,
        error: data.message || "Invalid email or password",
      };
    }

    // Check if the response contains a user ID
    const userId = data.id || data.userId;
    if (!userId) {
      console.error("Login response missing user ID:", data);
      return {
        success: false,
        error: "User ID is missing in response",
      };
    }

    console.log(`Setting user ID cookie: ${userId}`);
    // Set the user ID in cookies
    const cookieSet = setCurrentUserId(userId);

    if (!cookieSet) {
      console.error("Failed to set user ID cookie");
      return {
        success: false,
        error: "Failed to set user ID cookie",
      };
    }

    console.log("Login successful");
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "An error occurred during login. Please try again.",
    };
  }
};

/**
 * Register a new user
 * @param {Object} userData - The user data to register
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>} - The result of the registration attempt
 */
export const registerUser = async (userData) => {
  try {
    const response = await fetch("http://localhost:8080/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Check if the response indicates a user already exists
      if (response.status === 409) {
        return {
          success: false,
          error: "User already exists. Please try logging in.",
        };
      }

      return {
        success: false,
        error: data.message || "Registration failed. Please try again.",
      };
    }

    // Check if the response contains a user ID
    if (!data.id && !data.userId) {
      return {
        success: false,
        error: "User ID is missing in response",
      };
    }

    // Set the user ID in cookies
    const userId = data.id || data.userId;
    const cookieSet = setCurrentUserId(userId);

    if (!cookieSet) {
      return {
        success: false,
        error: "Failed to set user ID cookie",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: "An error occurred during registration. Please try again.",
    };
  }
};

/**
 * Logout the current user
 * @returns {boolean} - Whether the logout was successful
 */
export const logoutUser = () => {
  return clearCurrentUserId();
};

export default {
  isAuthenticated,
  getCurrentUserId,
  setCurrentUserId,
  clearCurrentUserId,
  fetchCurrentUser,
  loginUser,
  registerUser,
  logoutUser,
};
