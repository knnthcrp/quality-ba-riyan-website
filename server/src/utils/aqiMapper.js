/**
 * Map AQI values into human-readable categories
 * Based on US EPA standards
 */
const getAqiLevel = (aqi) => {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
};

/**
 * Standardize raw IQAir API response
 */
const mapIQAirData = (data) => {
  const { city, current } = data;
  const pollution = current.pollution;
  
  // Standardized response format
  return {
    city: city,
    aqi: pollution.aqius,
    level: getAqiLevel(pollution.aqius),
    pollutants: {
      // Free API provides the "main" pollutant that determines the AQI
      pm2_5: pollution.mainus === 'p2' ? pollution.aqius : null,
      pm10: pollution.mainus === 'p1' ? pollution.aqius : null,
      co: null // Rarely provided in the basic city endpoint
    },
    timestamp: pollution.ts,
    source: "IQAir"
  };
};

module.exports = { mapIQAirData, getAqiLevel };
