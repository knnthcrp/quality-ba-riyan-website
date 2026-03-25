require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const airQualityRoutes = require('./src/routes/airQualityRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

/**
 * Security & Logging Middleware
 */
app.use(cors()); // Enable CORS for frontend
app.use(express.json()); // Body parser

// Basic Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: true,
    message: "Too many requests, please try again later."
  }
});
app.use('/api/', limiter);

/**
 * Routes
 */
app.use('/api', airQualityRoutes);

/**
 * Health Check Endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'UP', timestamp: new Date().toISOString() });
});

/**
 * Error Handling Middleware
 */
app.use((err, req, res, next) => {
  console.error('[Error Handlers]', err.stack);
  res.status(500).json({
    error: true,
    message: "Something went wrong on the server!"
  });
});

/**
 * Start Server
 */
app.listen(PORT, () => {
  console.log(`[Server] QBR Backend running on port ${PORT}`);
  console.log(`[Server] Ready to serve air quality data for Metro Manila`);
});
