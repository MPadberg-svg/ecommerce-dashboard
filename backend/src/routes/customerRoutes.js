const { Router } = require('express');
const { getCustomers } = require('../controllers/customerController');
const { requireAuth, requireRole } = require('../middleware/jwt');

const router = Router();

router.get('/', requireAuth, requireRole('admin'), getCustomers);

module.exports = router;
