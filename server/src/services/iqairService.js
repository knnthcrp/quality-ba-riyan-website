const axios = require('axios');
const NodeCache = require('node-cache');
const { mapIQAirData } = require('../utils/aqiMapper');

// Initialize cache with 15-minute standard TTL (900 seconds)
const cache = new NodeCache({ stdTTL: 900 });

/**
 * Fetch air quality data for a specific city
 * Uses in-memory caching to prevent rate limiting
 */
// Precise coordinates for 17 LGUs to ensure IQAir "nearest_city" finds them reliably
const LGU_COORDINATES = {
  'manila': { lat: 14.5995, lon: 120.9842 },
  'quezon city': { lat: 14.6760, lon: 121.0492 },
  'caloocan': { lat: 14.7566, lon: 121.0373 },
  'las piñas': { lat: 14.4445, lon: 120.9939 },
  'makati': { lat: 14.5547, lon: 121.0359 },
  'malabon': { lat: 14.6681, lon: 120.9460 },
  'mandaluyong': { lat: 14.5794, lon: 121.0359 },
  'marikina': { lat: 14.6507, lon: 121.1029 },
  'muntinlupa': { lat: 14.4081, lon: 121.0415 },
  'navotas': { lat: 14.6557, lon: 120.9473 },
  'parañaque': { lat: 14.4789, lon: 121.0125 },
  'pasay': { lat: 14.5378, lon: 121.0014 },
  'pasig': { lat: 14.5764, lon: 121.0851 },
  'pateros': { lat: 14.5458, lon: 121.0688 },
  'san juan': { lat: 14.6042, lon: 121.0319 },
  'taguig': { lat: 14.5176, lon: 121.0509 },
  'valenzuela': { lat: 14.7005, lon: 120.9904 }
};

/**
 * Fetch air quality data for a specific city
 * Uses coordinate lookup for LGUs for 100% reliability
 */
const fetchAirQuality = async (city) => {
  const normalizedCity = city.toLowerCase().trim();
  
  // Check cache first
  const cachedData = cache.get(normalizedCity);
  if (cachedData) {
    console.log(`[Cache] Hit for: ${normalizedCity}`);
    return cachedData;
  }

  const apiKey = process.env.IQAIR_API_KEY;
  if (!apiKey) throw new Error('IQAIR_API_KEY is missing');

  try {
    let response;
    const lgu = LGU_COORDINATES[normalizedCity];

    if (lgu) {
      // Use Coordinate lookup for LGUs (Guaranteed result from nearest_city)
      console.log(`[API] LGU Match: Fetching via coordinates for ${normalizedCity}`);
      response = await axios.get('https://api.airvisual.com/v2/nearest_city', {
        params: { lat: lgu.lat, lon: lgu.lon, key: apiKey }
      });
    } else {
      // Fallback to name-based search for others (Pickier)
      console.log(`[API] Fetching by name: ${city}`);
      // Try 'National Capital Region' as it's the official IQAir state for the area
      response = await axios.get('https://api.airvisual.com/v2/city', {
        params: { city, state: 'National Capital Region', country: 'Philippines', key: apiKey }
      });
    }
    
    if (response.data.status === 'success') {
      const standardizedData = mapIQAirData(response.data.data);
      if (lgu) standardizedData.city = city; // Keep the searched city name for display
      cache.set(normalizedCity, standardizedData);
      return standardizedData;
    } else {
      throw new Error(response.data.data?.message || 'City not found');
    }
  } catch (error) {
    console.error(`[Service] Error:`, error.message);
    throw new Error(error.response?.data?.data?.message || error.message);
  }
};

module.exports = { fetchAirQuality };
