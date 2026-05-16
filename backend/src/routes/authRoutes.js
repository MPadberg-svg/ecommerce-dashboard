const { Router } = require('express');
const { login, me } = require('../controllers/authController');
// 1. Changed requireAuth to authenticate
const { authenticate } = require('../middleware/auth'); 
const { authValidators } = require('../utils/validators');
const { authLimiter } = require('../middleware/rateLimit');

const router = Router();

router.post('/login', authLimiter, authValidators, login);
// 2. Changed requireAuth to authenticate
router.get('/me', authenticate, me);

module.exports = router;