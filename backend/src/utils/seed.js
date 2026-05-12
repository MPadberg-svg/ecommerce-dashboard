const bcrypt = require('bcryptjs');
const pool = require('../config/database');

const categories = ['Electronics', 'Books', 'Fashion', 'Home', 'Sports'];
const statuses = ['Pending', 'Shipped', 'Delivered'];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function createSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role VARCHAR(20) NOT NULL CHECK(role IN ('admin', 'customer')),
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      price NUMERIC(10,2) NOT NULL CHECK(price >= 0),
      stock INT NOT NULL CHECK(stock >= 0),
      image_url TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      total NUMERIC(10,2) NOT NULL CHECK(total >= 0),
      status VARCHAR(20) NOT NULL CHECK(status IN ('Pending', 'Shipped', 'Delivered')),
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id INT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
      quantity INT NOT NULL CHECK(quantity > 0),
      price NUMERIC(10,2) NOT NULL CHECK(price >= 0)
    );
  `);
}

async function clearTables() {
  await pool.query('TRUNCATE TABLE order_items, orders, products, users RESTART IDENTITY CASCADE');
}

async function seedUsers() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const users = [
    { email: 'admin@dashboard.com', role: 'admin' },
    ...Array.from({ length: 10 }, (_, i) => ({
      email: `customer${i + 1}@mail.com`,
      role: 'customer',
    })),
  ];

  for (const user of users) {
    await pool.query('INSERT INTO users(email, password_hash, role) VALUES ($1, $2, $3)', [
      user.email,
      passwordHash,
      user.role,
    ]);
  }
}

async function seedProducts() {
  for (let i = 1; i <= 50; i += 1) {
    const category = categories[i % categories.length];
    await pool.query(
      'INSERT INTO products(name, category, price, stock, image_url) VALUES ($1, $2, $3, $4, $5)',
      [
        `Product ${i}`,
        category,
        (Math.random() * 200 + 10).toFixed(2),
        randomInt(5, 100),
        `https://picsum.photos/seed/product-${i}/200/200`,
      ],
    );
  }
}

async function seedOrders() {
  const customerIds = (await pool.query("SELECT id FROM users WHERE role = 'customer' ORDER BY id")).rows.map(
    (row) => row.id,
  );
  const products = (await pool.query('SELECT id, price FROM products ORDER BY id')).rows;

  for (let i = 0; i < 20; i += 1) {
    const userId = customerIds[i % customerIds.length];
    const itemCount = randomInt(1, 4);
    const orderItems = [];

    for (let j = 0; j < itemCount; j += 1) {
      const product = products[randomInt(0, products.length - 1)];
      const quantity = randomInt(1, 3);
      orderItems.push({ productId: product.id, quantity, price: Number(product.price) });
    }

    const total = orderItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const orderResult = await pool.query(
      'INSERT INTO orders(user_id, total, status, created_at) VALUES ($1, $2, $3, NOW() - ($4 || \' days\')::interval) RETURNING id',
      [userId, total.toFixed(2), statuses[i % statuses.length], randomInt(0, 29)],
    );

    for (const item of orderItems) {
      await pool.query(
        'INSERT INTO order_items(order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderResult.rows[0].id, item.productId, item.quantity, item.price],
      );
    }
  }
}

async function main() {
  try {
    await createSchema();
    await clearTables();
    await seedUsers();
    await seedProducts();
    await seedOrders();
    console.log('Seed complete: 1 admin, 10 customers, 50 products, 20 orders');
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
