const express = require('express');
const router = express.Router();
const { getAirQuality } = require('../controllers/airQualityController');

/**
 * Air Quality Routes
 */
router.get('/air-quality', getAirQuality);

// Placeholder for batch endpoint if needed later
// router.get('/air-quality/batch', getBatchAirQuality);

module.exports = router;
