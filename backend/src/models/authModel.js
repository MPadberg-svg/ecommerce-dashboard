const pool = require('../config/database');

async function getUserByEmail(email) {
  const result = await pool.query(
    'SELECT id, email, password_hash, role, created_at FROM users WHERE email = $1',
    [email],
  );
  return result.rows[0] || null;
}

async function getUserById(id) {
  const result = await pool.query(
    'SELECT id, email, role, created_at FROM users WHERE id = $1',
    [id],
  );
  return result.rows[0] || null;
}

module.exports = { getUserByEmail, getUserById };
