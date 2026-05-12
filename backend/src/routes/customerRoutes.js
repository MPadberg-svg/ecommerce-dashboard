const { Router } = require('express');
const { getCustomers } = require('../controllers/customerController');
const { requireAuth, requireRole } = require('../middleware/jwt');
const { apiLimiter } = require('../middleware/rateLimit');

const router = Router();

router.get('/', requireAuth, apiLimiter, requireRole('admin'), getCustomers);

module.exports = router;
