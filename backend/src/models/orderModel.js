const pool = require('../config/database');

async function listOrders({ page = 1, limit = 10, status, userId }) {
  const offset = (page - 1) * limit;
  const values = [];
  const clauses = [];

  if (status) {
    values.push(status);
    clauses.push(`o.status = $${values.length}`);
  }

  if (userId) {
    values.push(userId);
    clauses.push(`o.user_id = $${values.length}`);
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';

  const listQuery = `
    SELECT o.id, o.user_id, u.email AS customer_email, u.full_name AS customer_name, o.total, o.status, o.created_at
    FROM orders o
    JOIN users u ON u.id = o.user_id
    ${where}
    ORDER BY o.created_at DESC
    LIMIT $${values.length + 1} OFFSET $${values.length + 2}
  `;

  const countQuery = `SELECT COUNT(*)::int AS total FROM orders o ${where}`;

  const [listResult, countResult] = await Promise.all([
    pool.query(listQuery, [...values, limit, offset]),
    pool.query(countQuery, values),
  ]);

  return {
    data: listResult.rows,
    total: countResult.rows[0].total,
    page,
    limit,
  };
}

async function getOrderById(id) {
  const orderResult = await pool.query(`
    SELECT o.id, o.total, o.status, o.created_at, u.full_name as customer_name, u.email as customer_email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.id = $1
  `, [id]);

  if (!orderResult.rows.length) return null;
  const order = orderResult.rows[0];

  const itemsResult = await pool.query(`
    SELECT oi.quantity, oi.price_at_time, p.name as product_name, p.image_url
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = $1
  `, [id]);

  order.items = itemsResult.rows;
  return order;
}

// YOUR AWESOME TRANSACTIONAL CREATE FUNCTION (updated with price_at_time column)
async function createOrder({ userId, items }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const productIds = items.map((item) => item.product_id);
    const productsResult = await client.query(
      'SELECT id, name, price, stock FROM products WHERE id = ANY($1::int[])',
      [productIds],
    );

    const productsMap = new Map(productsResult.rows.map((item) => [item.id, item]));
    let total = 0;

    for (const item of items) {
      const product = productsMap.get(item.product_id);
      if (!product) {
        const error = new Error(`Product ${item.product_id} not found`);
        error.status = 404;
        throw error;
      }
      if (product.stock < item.quantity) {
        const error = new Error(`Insufficient stock for ${product.name}`);
        error.status = 400;
        throw error;
      }
      total += Number(product.price) * Number(item.quantity);
    }

    const orderResult = await client.query(
      'INSERT INTO orders(user_id, total, status) VALUES ($1, $2, $3) RETURNING id, user_id, total, status, created_at',
      [userId, total, 'Pending'],
    );

    const order = orderResult.rows[0];

    for (const item of items) {
      const product = productsMap.get(item.product_id);
      await client.query(
        'INSERT INTO order_items(order_id, product_id, quantity, price_at_time) VALUES ($1, $2, $3, $4)',
        [order.id, item.product_id, item.quantity, product.price],
      );
      await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [
        item.quantity,
        item.product_id,
      ]);
    }

    await client.query('COMMIT');
    return order;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function updateOrderStatus(id, status) {
  const result = await pool.query(
    'UPDATE orders SET status = $1 WHERE id = $2 RETURNING id, user_id, total, status, created_at',
    [status, id],
  );
  return result.rows[0] || null;
}

module.exports = { listOrders, getOrderById, createOrder, updateOrderStatus };