const { Router } = require('express');
const { getOrders, getOrder, createOrder, updateStatus } = require('../controllers/orderController');
// 1. Changed requireAdmin to requireRole
const { authenticate, requireRole } = require('../middleware/auth'); 

const router = Router();

// Staff can view orders, but only admins can update the status
router.get('/', authenticate, getOrders);
router.get('/:id', authenticate, getOrder);

// Any authenticated user can create an order
router.post('/', authenticate, createOrder);

// 2. Changed requireAdmin to requireRole('admin')
router.patch('/:id/status', authenticate, requireRole(['admin']), updateStatus);

module.exports = router;