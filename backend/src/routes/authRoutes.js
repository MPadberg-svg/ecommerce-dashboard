const { Router } = require('express');
const { login, me } = require('../controllers/authController');
const { requireAuth } = require('../middleware/jwt');
const { authValidators } = require('../utils/validators');

const router = Router();

router.post('/login', authValidators, login);
router.get('/me', requireAuth, me);

module.exports = router;
