const pool = require('../config/database');

async function listCustomers() {
  const result = await pool.query(
    `SELECT u.id, u.email, u.role, u.created_at, COUNT(o.id)::int AS order_count
     FROM users u
     LEFT JOIN orders o ON o.user_id = u.id
     WHERE u.role = 'customer'
     GROUP BY u.id
     ORDER BY u.created_at DESC`,
  );
  return result.rows;
}

module.exports = { listCustomers };
