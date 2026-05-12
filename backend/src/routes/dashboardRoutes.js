const { Router } = require('express');
const { getStats } = require('../controllers/dashboardController');
const { requireAuth } = require('../middleware/jwt');
const { apiLimiter } = require('../middleware/rateLimit');

const router = Router();

router.get('/stats', requireAuth, apiLimiter, getStats);

module.exports = router;
