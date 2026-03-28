const { fetchAirQuality } = require('../services/iqairService');

/**
 * Controller for air quality requests
 * Refactored for serverless compatibility (returns data directly)
 */
const getAirQuality = async (city) => {
  console.log('[Controller] getAirQuality called for:', city);
  if (!city) {
    console.warn('[Controller] Missing city parameter');
    const error = new Error("City query parameter is required");
    error.status = 400;
    throw error;
  }

  try {
    console.log('[Controller] Fetching data from service...');
    const data = await fetchAirQuality(city);
    console.log('[Controller] Data fetched successfully');
    return data;
  } catch (error) {
    console.error(`[Controller] Error for city ${city}:`, error.message);
    
    // Determine status code based on error message
    let status = 500;
    if (error.message.includes('not found') || error.message.includes('city_not_found')) {
      status = 404;
    } else if (error.message.includes('API level') || error.message.includes('limit exceeded')) {
      status = 429;
    }

    const customError = new Error(error.message || "Failed to fetch air quality data");
    customError.status = status;
    throw customError;
  }
};

module.exports = { getAirQuality };
