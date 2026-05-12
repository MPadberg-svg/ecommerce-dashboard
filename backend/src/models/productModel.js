const pool = require('../config/database');

function buildFilter({ search, category }) {
  const clauses = [];
  const values = [];

  if (search) {
    values.push(`%${search}%`);
    clauses.push(`name ILIKE $${values.length}`);
  }

  if (category) {
    values.push(category);
    clauses.push(`category = $${values.length}`);
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  return { where, values };
}

async function listProducts({ page = 1, limit = 10, search, category }) {
  const offset = (page - 1) * limit;
  const { where, values } = buildFilter({ search, category });

  const listQuery = `
    SELECT id, name, category, price, stock, image_url, created_at
    FROM products
    ${where}
    ORDER BY created_at DESC
    LIMIT $${values.length + 1} OFFSET $${values.length + 2}
  `;

  const countQuery = `SELECT COUNT(*)::int AS total FROM products ${where}`;

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

async function getProductById(id) {
  const result = await pool.query(
    'SELECT id, name, category, price, stock, image_url, created_at FROM products WHERE id = $1',
    [id],
  );
  return result.rows[0] || null;
}

async function createProduct(payload) {
  const { name, category, price, stock, image_url } = payload;
  const result = await pool.query(
    `INSERT INTO products(name, category, price, stock, image_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, category, price, stock, image_url, created_at`,
    [name, category, price, stock, image_url || null],
  );
  return result.rows[0];
}

async function updateProduct(id, payload) {
  const existing = await getProductById(id);
  if (!existing) {
    return null;
  }

  const next = {
    name: payload.name ?? existing.name,
    category: payload.category ?? existing.category,
    price: payload.price ?? existing.price,
    stock: payload.stock ?? existing.stock,
    image_url: payload.image_url ?? existing.image_url,
  };

  const result = await pool.query(
    `UPDATE products
     SET name = $1, category = $2, price = $3, stock = $4, image_url = $5
     WHERE id = $6
     RETURNING id, name, category, price, stock, image_url, created_at`,
    [next.name, next.category, next.price, next.stock, next.image_url, id],
  );

  return result.rows[0];
}

async function deleteProduct(id) {
  const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
  return Boolean(result.rows[0]);
}

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
