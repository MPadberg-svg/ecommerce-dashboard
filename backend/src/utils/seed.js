const dotenv = require('dotenv');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const USERS = [
  { fullName: 'Admin User', email: 'admin@shop.com', role: 'admin', password: 'admin123' },
  { fullName: 'Store Manager', email: 'manager@shop.com', role: 'admin', password: 'admin123' },
  { fullName: 'John Doe', email: 'customer1@shop.com', role: 'customer', password: 'password123' },
  { fullName: 'Jane Smith', email: 'customer2@shop.com', role: 'customer', password: 'password123' },
  { fullName: 'Michael Brown', email: 'customer3@shop.com', role: 'customer', password: 'password123' },
  { fullName: 'Emily Davis', email: 'customer4@shop.com', role: 'customer', password: 'password123' },
  { fullName: 'David Wilson', email: 'customer5@shop.com', role: 'customer', password: 'password123' },
  { fullName: 'Sarah Johnson', email: 'customer6@shop.com', role: 'customer', password: 'password123' },
  { fullName: 'Daniel Lee', email: 'customer7@shop.com', role: 'customer', password: 'password123' },
  { fullName: 'Olivia Taylor', email: 'customer8@shop.com', role: 'customer', password: 'password123' },
];

const PRODUCTS = [
  { name: 'Wireless Headphones', category: 'Electronics', price: 89.99, stock: 45 },
  { name: 'Bluetooth Speaker', category: 'Electronics', price: 45.0, stock: 30 },
  { name: 'USB-C Cable', category: 'Electronics', price: 12.99, stock: 100 },
  { name: 'Mechanical Keyboard', category: 'Electronics', price: 129.99, stock: 20 },
  { name: '4K Monitor', category: 'Electronics', price: 349.99, stock: 15 },
  { name: 'Wireless Mouse', category: 'Electronics', price: 34.99, stock: 50 },
  { name: 'Laptop Stand', category: 'Electronics', price: 49.99, stock: 35 },
  { name: 'Webcam HD', category: 'Electronics', price: 79.99, stock: 25 },
  { name: 'Portable Charger', category: 'Electronics', price: 39.99, stock: 60 },
  { name: 'Smart Watch', category: 'Electronics', price: 199.99, stock: 18 },

  { name: 'Cotton T-Shirt', category: 'Clothing', price: 24.99, stock: 80 },
  { name: 'Denim Jeans', category: 'Clothing', price: 59.99, stock: 40 },
  { name: 'Running Shoes', category: 'Clothing', price: 89.99, stock: 35 },
  { name: 'Winter Jacket', category: 'Clothing', price: 129.99, stock: 20 },
  { name: 'Baseball Cap', category: 'Clothing', price: 19.99, stock: 55 },
  { name: 'Wool Socks (3-pack)', category: 'Clothing', price: 14.99, stock: 70 },
  { name: 'Leather Belt', category: 'Clothing', price: 34.99, stock: 30 },
  { name: 'Sunglasses', category: 'Clothing', price: 49.99, stock: 25 },
  { name: 'Hoodie', category: 'Clothing', price: 54.99, stock: 45 },
  { name: 'Dress Shirt', category: 'Clothing', price: 44.99, stock: 38 },

  { name: 'Organic Coffee Beans', category: 'Food', price: 18.99, stock: 50 },
  { name: 'Green Tea Set', category: 'Food', price: 24.99, stock: 40 },
  { name: 'Dark Chocolate Bar', category: 'Food', price: 7.99, stock: 100 },
  { name: 'Olive Oil (500ml)', category: 'Food', price: 15.99, stock: 35 },
  { name: 'Honey Jar', category: 'Food', price: 12.99, stock: 45 },
  { name: 'Mixed Nuts', category: 'Food', price: 19.99, stock: 30 },
  { name: 'Pasta Pack', category: 'Food', price: 8.99, stock: 80 },
  { name: 'Spices Set', category: 'Food', price: 29.99, stock: 25 },
  { name: 'Protein Bars (6-pack)', category: 'Food', price: 22.99, stock: 60 },
  { name: 'Dried Fruits', category: 'Food', price: 14.99, stock: 40 },

  { name: 'JavaScript Guide', category: 'Books', price: 39.99, stock: 25 },
  { name: 'Python Cookbook', category: 'Books', price: 44.99, stock: 20 },
  { name: 'Design Patterns', category: 'Books', price: 54.99, stock: 18 },
  { name: 'Clean Code', category: 'Books', price: 42.99, stock: 30 },
  { name: 'Database Internals', category: 'Books', price: 59.99, stock: 15 },
  { name: 'React Mastery', category: 'Books', price: 49.99, stock: 22 },
  { name: 'Node.js Design', category: 'Books', price: 39.99, stock: 28 },
  { name: 'Docker Deep Dive', category: 'Books', price: 44.99, stock: 20 },
  { name: 'System Architecture', category: 'Books', price: 69.99, stock: 12 },
  { name: 'AI Fundamentals', category: 'Books', price: 54.99, stock: 18 },

  { name: 'LED Desk Lamp', category: 'Home', price: 34.99, stock: 40 },
  { name: 'Throw Pillow Set', category: 'Home', price: 29.99, stock: 35 },
  { name: 'Storage Boxes (3-pack)', category: 'Home', price: 19.99, stock: 50 },
  { name: 'Wall Clock', category: 'Home', price: 24.99, stock: 30 },
  { name: 'Photo Frame', category: 'Home', price: 14.99, stock: 45 },
  { name: 'Bath Towels (2-pack)', category: 'Home', price: 22.99, stock: 40 },
  { name: 'Kitchen Organizer', category: 'Home', price: 27.99, stock: 25 },
  { name: 'Plant Pot Set', category: 'Home', price: 18.99, stock: 55 },
  { name: 'Candle Set', category: 'Home', price: 16.99, stock: 60 },
  { name: 'Door Mat', category: 'Home', price: 21.99, stock: 35 },
];

const ORDER_STATUSES = [
  ...Array(5).fill('Pending'),
  ...Array(8).fill('Shipped'),
  ...Array(5).fill('Delivered'),
  ...Array(2).fill('Cancelled'),
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = randomInt(0, i);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function pickRandomUnique(items, count) {
  const picked = new Set();
  while (picked.size < count) {
    picked.add(randomInt(0, items.length - 1));
  }
  return [...picked].map((index) => items[index]);
}

function productImageUrl(name) {
  return `https://via.placeholder.com/300x200?text=${encodeURIComponent(name)}`;
}

function randomDateWithinLast30Days() {
  const daysAgo = randomInt(0, 29);
  const secondsAgo = randomInt(0, 86399);
  return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000 - secondsAgo * 1000);
}

async function seedDatabase() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(`
      DROP TABLE IF EXISTS order_items;
      DROP TABLE IF EXISTS orders;
      DROP TABLE IF EXISTS products;
      DROP TABLE IF EXISTS users;
    `);

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(20) NOT NULL CHECK(role IN ('admin', 'customer')),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        price NUMERIC(10,2) NOT NULL CHECK(price >= 0),
        stock INT NOT NULL CHECK(stock >= 0),
        image_url TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        total NUMERIC(10,2) NOT NULL CHECK(total >= 0),
        status VARCHAR(20) NOT NULL CHECK(status IN ('Pending', 'Shipped', 'Delivered', 'Cancelled')),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE order_items (
        id SERIAL PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL CHECK(quantity > 0),
        price_at_time NUMERIC(10,2) NOT NULL CHECK(price_at_time >= 0)
      );
    `);

    await client.query(`
      ALTER TABLE orders
        ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

      ALTER TABLE order_items
        ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT;
    `);

    const adminHash = await bcrypt.hash('admin123', 12);
    const customerHash = await bcrypt.hash('password123', 12);

    const customerIds = [];
    for (const user of USERS) {
      const passwordHash = user.role === 'admin' ? adminHash : customerHash;
      const result = await client.query(
        'INSERT INTO users(full_name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id',
        [user.fullName, user.email, passwordHash, user.role],
      );

      if (user.role === 'customer') {
        customerIds.push(result.rows[0].id);
      }
    }
    const userCount = USERS.length;

    const insertedProducts = [];
    for (const product of PRODUCTS) {
      const result = await client.query(
        'INSERT INTO products(name, category, price, stock, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING id, price',
        [product.name, product.category, product.price.toFixed(2), product.stock, productImageUrl(product.name)],
      );
      insertedProducts.push(result.rows[0]);
    }
    const productCount = PRODUCTS.length;

    const statuses = shuffle([...ORDER_STATUSES]);
    for (const status of statuses) {
      const userId = customerIds[randomInt(0, customerIds.length - 1)];
      const createdAt = randomDateWithinLast30Days();
      const selectedProducts = pickRandomUnique(insertedProducts, 3);

      let total = 0;
      const items = selectedProducts.map((product) => {
        const quantity = randomInt(1, 5);
        const priceAtTime = Number(product.price);
        total += quantity * priceAtTime;
        return {
          productId: product.id,
          quantity,
          priceAtTime,
        };
      });

      const orderResult = await client.query(
        'INSERT INTO orders(user_id, total, status, created_at) VALUES ($1, $2, $3, $4) RETURNING id',
        [userId, total.toFixed(2), status, createdAt],
      );

      for (const item of items) {
        await client.query('INSERT INTO order_items(order_id, product_id, quantity, price_at_time) VALUES ($1, $2, $3, $4)', [
          orderResult.rows[0].id,
          item.productId,
          item.quantity,
          item.priceAtTime.toFixed(2),
        ]);
      }
    }
    const orderCount = statuses.length;

    await client.query('COMMIT');
    console.log(`Seeded ${userCount} users, ${productCount} products, ${orderCount} orders`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

seedDatabase()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
