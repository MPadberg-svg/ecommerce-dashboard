const { Router } = require('express');
const { getOrders, postOrder, putOrder } = require('../controllers/orderController');
const { requireAuth, requireRole } = require('../middleware/jwt');
const { apiLimiter } = require('../middleware/rateLimit');
const { orderCreateValidators, orderStatusValidators } = require('../utils/validators');

const router = Router();

router.use(requireAuth, apiLimiter);
router.get('/', getOrders);
router.post('/', orderCreateValidators, postOrder);
router.put('/:id', requireRole('admin'), orderStatusValidators, putOrder);

module.exports = router;
