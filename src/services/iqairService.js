import axios from 'axios';

const IQAIR_BASE_URL = 'https://api.airvisual.com/v2';
const API_KEY = import.meta.env.VITE_IQAIR_API_KEY;

export const getNearestCityData = async (lat, lon) => {
  try {
    const response = await axios.get(`${IQAIR_BASE_URL}/nearest_city`, {
      params: {
        lat,
        lon,
        key: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching nearest city AQI data:', error);
    throw error;
  }
};

// Note: For searching specific cities, the IQAir free API requires state and country.
// We default to Metro Manila, Philippines for the MVP specific criteria.
export const getCityDataByName = async (city, state = 'Metro Manila', country = 'Philippines') => {
  try {
    const response = await axios.get(`${IQAIR_BASE_URL}/city`, {
      params: {
        city,
        state,
        country,
        key: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching city AQI data:', error);
    throw error;
  }
};
