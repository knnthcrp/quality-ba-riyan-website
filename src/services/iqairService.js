import axios from 'axios';

const BACKEND_URL = '/api';

/**
 * Note: For the MVP, we are using the city-based search via our backend.
 * The backend proxies IQAir and provides standardized, cached data.
 */
export const getCityDataByName = async (city) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/air-quality`, {
      params: { city },
    });
    // Return the 'data' property from the standardized response format { success: true, data: ... }
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message;
    console.error('Error fetching city air quality from backend:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Geolocation-based data placeholder. 
 * For now, we fallback to city-based search using the detected city name,
 * or default to Manila if the backend doesn't support lat/lon yet.
 */
export const getNearestCityData = async (lat, lon) => {
  // In a real scenario, the backend would have a /nearest-city endpoint.
  // For this MVP transition, we'll default to Manila or a known city.
  return getCityDataByName('Manila');
};
