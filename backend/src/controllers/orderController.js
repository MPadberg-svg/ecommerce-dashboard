const { listOrders, createOrder, updateOrderStatus } = require('../models/orderModel');

async function getOrders(req, res, next) {
  try {
    const userId = req.user.role === 'customer' ? req.user.id : Number(req.query.user_id || 0) || null;
    const orders = await listOrders({ userId });
    return res.json(orders);
  } catch (error) {
    return next(error);
  }
}

async function postOrder(req, res, next) {
  try {
    const userId = req.user.role === 'customer' ? req.user.id : Number(req.body.user_id || req.user.id);
    const order = await createOrder({ userId, items: req.body.items });
    return res.status(201).json(order);
  } catch (error) {
    return next(error);
  }
}

async function putOrder(req, res, next) {
  try {
    const order = await updateOrderStatus(Number(req.params.id), req.body.status);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.json(order);
  } catch (error) {
    return next(error);
  }
}

module.exports = { getOrders, postOrder, putOrder };
