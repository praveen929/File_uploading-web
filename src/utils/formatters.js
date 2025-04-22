/**
 * Utility functions for formatting text and data
 */

/**
 * Strip HTML tags from a string
 * @param {string} html - The HTML string to strip
 * @returns {string} - The plain text without HTML tags
 */
export const stripHtml = (html) => {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

/**
 * Format a date string to a localized date format
 * @param {string} dateString - The date string to format
 * @param {string} locale - The locale to use (default: 'en-GB')
 * @returns {string} - The formatted date string
 */
export const formatDate = (dateString, locale = "en-GB") => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString(locale);
};

/**
 * Truncate a string to a specified length and add ellipsis
 * @param {string} str - The string to truncate
 * @param {number} maxLength - The maximum length of the string
 * @returns {string} - The truncated string
 */
export const truncateString = (str, maxLength = 100) => {
  if (!str) return "";
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + "...";
};
