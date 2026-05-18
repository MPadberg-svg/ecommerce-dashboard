const { Router } = require('express');
const { getDashboardStats } = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/auth');

const router = Router();

// GET /api/dashboard/stats -> Protected by JWT
router.get('/stats', authenticate, getDashboardStats);

module.exports = router;
