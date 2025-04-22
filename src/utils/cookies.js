/**
 * Utility functions for handling cookies
 */

/**
 * Get a cookie value by name
 * @param {string} name - The name of the cookie
 * @returns {string|null} - The cookie value or null if not found
 */
export const getCookie = (name) => {
  const cookieString = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  return cookieString ? decodeURIComponent(cookieString.split("=")[1]) : null;
};

/**
 * Set a cookie with the given name, value, and options
 * @param {string} name - The name of the cookie
 * @param {string} value - The value of the cookie
 * @param {number} days - Number of days until the cookie expires
 */
export const setCookie = (name, value, days) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
};

/**
 * Remove a cookie by name
 * @param {string} name - The name of the cookie to remove
 */
export const removeCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};
