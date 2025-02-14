/**
 * capitalizeFirst
 * Capitalizes the first letter of a given string.
 *
 * @param {string} str - The string to capitalize.
 * @returns {string} - The formatted string with the first letter capitalized.
 */
export const capitalizeFirst = (str: string): string => {
    if (!str.trim()) return ""; // Ensure string is not empty after trimming
    return str.trim().charAt(0).toUpperCase() + str.trim().slice(1);
};
