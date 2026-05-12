const { listCustomers } = require('../models/customerModel');

async function getCustomers(req, res, next) {
  try {
    const customers = await listCustomers();
    return res.json(customers);
  } catch (error) {
    return next(error);
  }
}

module.exports = { getCustomers };
