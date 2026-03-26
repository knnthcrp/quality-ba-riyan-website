import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { getAirQuality } = require('../server/src/controllers/airQualityController');
const cors = require('cors');

// Initialize CORS middleware
const corsMiddleware = cors({
  origin: '*', // For production, replace with your frontend URL
  methods: ['GET', 'OPTIONS'],
});

// Helper to run middleware in Vercel functions
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

/**
 * Vercel Serverless Function: GET /api/air-quality
 */
export default async function handler(req, res) {
  // 1. Run CORS middleware
  await runMiddleware(req, res, corsMiddleware);

  // 2. Extract query parameters
  const { city } = req.query;

  // 3. Process request via Controller
  try {
    const data = await getAirQuality(city);
    
    return res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      error: error.message || "Something went wrong on the server!"
    });
  }
}
