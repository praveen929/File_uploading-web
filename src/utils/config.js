/**
 * Application configuration
 */

// API base URL - change this to your backend URL
// For local development
export const API_BASE_URL = "http://localhost:8080";

// For production
// export const API_BASE_URL = "https://file-storing-backend.onrender.com";

// API endpoints
export const API_ENDPOINTS = {
  // User endpoints
  LOGIN: `${API_BASE_URL}/users/login`,
  REGISTER: `${API_BASE_URL}/users/register`,
  GET_USER: (id) => `${API_BASE_URL}/users/${id}`,
  GET_ALL_USERS: `${API_BASE_URL}/users`,
  SEARCH_USERS: (query) => `${API_BASE_URL}/users/search?query=${query}`,
  UPDATE_USER: (id) => `${API_BASE_URL}/users/${id}`,

  // File endpoints
  UPLOAD_FILE: (userId) => `${API_BASE_URL}/files/upload/${userId}`,
  GET_ALL_FILES: `${API_BASE_URL}/files/all`,
  GET_USER_FILES: (userId) => `${API_BASE_URL}/files/user/${userId}`,
  GET_FILE: (fileId) => `${API_BASE_URL}/files/${fileId}`,
  UPDATE_FILE: (fileId, userId) =>
    `${API_BASE_URL}/files/update/${fileId}/${userId}`,
  DELETE_FILE: (fileId, userId) =>
    `${API_BASE_URL}/files/delete/${fileId}/${userId}`,
  DOWNLOAD_FILE: (fileId) => `${API_BASE_URL}/files/download/${fileId}`,
  VIEW_FILE: (fileName) => `${API_BASE_URL}/files/view/${fileName}`,
  SEARCH_FILES: (query) => `${API_BASE_URL}/files/search?query=${query}`,
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
};
