const { Router } = require('express');
const { getCustomers } = require('../controllers/customerController');
const { authenticate, requireRole } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimit');

const router = Router();

router.get('/', authenticate, apiLimiter, requireRole('admin'), getCustomers);

module.exports = router;
