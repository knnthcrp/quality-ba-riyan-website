const { fetchAirQuality } = require('../services/iqairService');

/**
 * Controller for air quality requests
 */
const getAirQuality = async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({
      error: true,
      message: "City query parameter is required"
    });
  }

  try {
    const data = await fetchAirQuality(city);
    return res.json(data);
  } catch (error) {
    console.error(`[Controller] Error for city ${city}:`, error.message);
    
    // Determine status code based on error message
    let status = 500;
    if (error.message.includes('not found') || error.message.includes('city_not_found')) {
      status = 404;
    } else if (error.message.includes('API level') || error.message.includes('limit exceeded')) {
      status = 429;
    }

    return res.status(status).json({
      error: true,
      message: error.message || "Failed to fetch air quality data"
    });
  }
};

module.exports = { getAirQuality };
