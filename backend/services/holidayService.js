// services/holidayService.js

// In a real application, this might come from a database or an external API.
const publicHolidays = {
  2025: [
    '2025-01-26', // Republic Day
    '2025-03-14', // Holi
    '2025-08-15', // Independence Day
    '2025-10-02', // Gandhi Jayanti
    '2025-10-21', // Diwali
    '2025-12-25', // Christmas
  ]
};

/**
 * Gets the list of public holidays for a given year.
 * @param {number} year The year to get holidays for.
 * @returns {Set<string>} A Set of holiday dates in 'YYYY-MM-DD' format.
 */
export const getPublicHolidays = (year) => {
  return new Set(publicHolidays[year] || []);
};