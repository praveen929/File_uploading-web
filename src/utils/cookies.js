/**
 * Enhanced utility functions for handling cookies with better error handling
 */

/**
 * Get a cookie value by name with error handling
 * @param {string} name - The name of the cookie
 * @param {*} defaultValue - Default value to return if cookie is not found
 * @returns {string|defaultValue} - The cookie value or defaultValue if not found
 */
export const getCookie = (name, defaultValue = null) => {
  try {
    if (!document || !document.cookie) return defaultValue;

    const cookieString = document.cookie
      .split("; ")
      .find((row) => row && row.startsWith(name + "="));

    if (!cookieString) return defaultValue;

    const value = cookieString.split("=")[1];
    return value ? decodeURIComponent(value) : defaultValue;
  } catch (error) {
    console.error(`Error getting cookie '${name}':`, error);
    return defaultValue;
  }
};

/**
 * Set a cookie with the given name, value, and options
 * @param {string} name - The name of the cookie
 * @param {string} value - The value of the cookie
 * @param {number} days - Number of days until the cookie expires
 * @param {string} path - Cookie path (default: '/')
 * @param {boolean} secure - Whether the cookie should be secure (HTTPS only)
 * @returns {boolean} - Whether the cookie was set successfully
 */
export const setCookie = (
  name,
  value,
  days = 7,
  path = "/",
  secure = false
) => {
  try {
    if (!document) return false;

    if (!name || value === undefined) {
      console.error("Cannot set cookie: name or value is invalid");
      return false;
    }

    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    const securePart = secure ? "; secure" : "";

    document.cookie = `${name}=${encodeURIComponent(
      value
    )};${expires};path=${path}${securePart}`;
    return true;
  } catch (error) {
    console.error(`Error setting cookie '${name}':`, error);
    return false;
  }
};

/**
 * Remove a cookie by name
 * @param {string} name - The name of the cookie to remove
 * @param {string} path - Cookie path (default: '/')
 * @returns {boolean} - Whether the cookie was removed successfully
 */
export const removeCookie = (name, path = "/") => {
  try {
    if (!document) return false;

    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path}`;
    return true;
  } catch (error) {
    console.error(`Error removing cookie '${name}':`, error);
    return false;
  }
};

/**
 * Check if a cookie exists
 * @param {string} name - The name of the cookie to check
 * @returns {boolean} - Whether the cookie exists
 */
export const hasCookie = (name) => {
  return getCookie(name) !== null;
};

/**
 * Get all cookies as an object
 * @returns {Object} - All cookies as key-value pairs
 */
export const getAllCookies = () => {
  try {
    if (!document || !document.cookie) return {};

    const cookies = {};
    document.cookie.split("; ").forEach((cookie) => {
      if (!cookie) return;

      const parts = cookie.split("=");
      if (parts.length >= 2) {
        const name = parts[0];
        const value = parts.slice(1).join("=");
        cookies[name] = decodeURIComponent(value);
      }
    });

    return cookies;
  } catch (error) {
    console.error("Error getting all cookies:", error);
    return {};
  }
};
