const { Router } = require('express');
const { getStats } = require('../controllers/dashboardController');
const { requireAuth } = require('../middleware/jwt');

const router = Router();

router.get('/stats', requireAuth, getStats);

module.exports = router;
