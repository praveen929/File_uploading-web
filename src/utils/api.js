/**
 * API utilities for making requests to the backend
 */
import { getCurrentUserId } from './auth';

// Update this to your actual backend URL
const API_BASE_URL = "http://localhost:8080";

/**
 * Make a GET request to the API
 * @param {string} endpoint - The API endpoint to call
 * @param {Object} options - Additional fetch options
 * @returns {Promise<any>} - The response data
 */
export const apiGet = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Make a POST request to the API
 * @param {string} endpoint - The API endpoint to call
 * @param {Object} data - The data to send
 * @param {Object} options - Additional fetch options
 * @returns {Promise<any>} - The response data
 */
export const apiPost = async (endpoint, data, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data),
      ...options
    });

    // For 204 No Content responses
    if (response.status === 204) {
      return null;
    }

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || `API error: ${response.status}`);
    }

    return responseData;
  } catch (error) {
    console.error(`Error posting to ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Make a PUT request to the API
 * @param {string} endpoint - The API endpoint to call
 * @param {Object} data - The data to send
 * @param {Object} options - Additional fetch options
 * @returns {Promise<any>} - The response data
 */
export const apiPut = async (endpoint, data, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data),
      ...options
    });

    // For 204 No Content responses
    if (response.status === 204) {
      return null;
    }

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || `API error: ${response.status}`);
    }

    return responseData;
  } catch (error) {
    console.error(`Error putting to ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Make a DELETE request to the API
 * @param {string} endpoint - The API endpoint to call
 * @param {Object} options - Additional fetch options
 * @returns {Promise<any>} - The response data
 */
export const apiDelete = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    // For 204 No Content responses
    if (response.status === 204) {
      return null;
    }

    // Try to parse JSON, but don't fail if there's no content
    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return null;
    }

    if (!response.ok) {
      throw new Error(responseData.message || `API error: ${response.status}`);
    }

    return responseData;
  } catch (error) {
    console.error(`Error deleting from ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Upload a file to the API
 * @param {string} endpoint - The API endpoint to call
 * @param {FormData} formData - The form data to send
 * @param {Object} options - Additional fetch options
 * @returns {Promise<any>} - The response data
 */
export const apiUploadFile = async (endpoint, formData, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      // Don't set Content-Type header, let the browser set it with the boundary
      headers: {
        ...options.headers
      },
      body: formData,
      ...options
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || `API error: ${response.status}`);
    }

    return responseData;
  } catch (error) {
    console.error(`Error uploading to ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Get the current user's data
 * @returns {Promise<Object|null>} - The user data or null if not authenticated
 */
export const getCurrentUser = async () => {
  const userId = getCurrentUserId();
  
  if (!userId) {
    return null;
  }
  
  try {
    return await apiGet(`/users/${userId}`);
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};

/**
 * Get all files
 * @returns {Promise<Array>} - The list of files
 */
export const getAllFiles = async () => {
  try {
    return await apiGet('/files/all');
  } catch (error) {
    console.error('Error fetching all files:', error);
    return [];
  }
};

/**
 * Get files for the current user
 * @returns {Promise<Array>} - The list of files
 */
export const getCurrentUserFiles = async () => {
  const userId = getCurrentUserId();
  
  if (!userId) {
    return [];
  }
  
  try {
    return await apiGet(`/files/user/${userId}`);
  } catch (error) {
    console.error('Error fetching user files:', error);
    return [];
  }
};

/**
 * Search files
 * @param {string} query - The search query
 * @returns {Promise<Array>} - The list of files
 */
export const searchFiles = async (query) => {
  try {
    return await apiGet(`/files/search?query=${encodeURIComponent(query)}`);
  } catch (error) {
    console.error('Error searching files:', error);
    return [];
  }
};

/**
 * Get all users
 * @returns {Promise<Array>} - The list of users
 */
export const getAllUsers = async () => {
  try {
    return await apiGet('/users');
  } catch (error) {
    console.error('Error fetching all users:', error);
    return [];
  }
};

/**
 * Search users
 * @param {string} query - The search query
 * @returns {Promise<Array>} - The list of users
 */
export const searchUsers = async (query) => {
  try {
    return await apiGet(`/users/search?query=${encodeURIComponent(query)}`);
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
};

export default {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  apiUploadFile,
  getCurrentUser,
  getAllFiles,
  getCurrentUserFiles,
  searchFiles,
  getAllUsers,
  searchUsers
};
