const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');
const { analyticsLimiter } = require('../middleware/rateLimiter');

router.get('/', authMiddleware, analyticsLimiter, getAnalytics);

module.exports = router; 