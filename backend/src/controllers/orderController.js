const orderModel = require('../models/orderModel');

async function getOrders(req, res, next) {
  try {
    const { page = 1, limit = 10, status, userId } = req.query;
    const result = await orderModel.listOrders({
      page: Number(page),
      limit: Number(limit),
      status,
      userId,
    });
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

async function getOrder(req, res, next) {
  try {
    const order = await orderModel.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    return res.json(order);
  } catch (error) {
    return next(error);
  }
}

async function createOrder(req, res, next) {
  try {
    const { items } = req.body;
    // req.user.id comes from the JWT middleware!
    const newOrder = await orderModel.createOrder({ userId: req.user.id, items });
    return res.status(201).json(newOrder);
  } catch (error) {
    // Pass custom status codes from the model up to the client
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return next(error);
  }
}

async function updateStatus(req, res, next) {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedOrder = await orderModel.updateOrderStatus(req.params.id, status);
    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
    return res.json(updatedOrder);
  } catch (error) {
    return next(error);
  }
}

module.exports = { getOrders, getOrder, createOrder, updateStatus };
