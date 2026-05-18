const db = require('../config/database');

async function getSalesOverTime() {
  // Groups sales by date for the last 30 days (Line Chart)
  const result = await db.query(`
    SELECT DATE(created_at) as date, SUM(total) as daily_revenue 
    FROM orders 
    WHERE created_at >= NOW() - INTERVAL '30 days'
    GROUP BY DATE(created_at)
    ORDER BY DATE(created_at) ASC
  `);
  return result.rows;
}

async function getRevenueByCategory() {
  // Calculates total revenue per product category (Doughnut Chart)
  const result = await db.query(`
    SELECT p.category, SUM(oi.quantity * oi.price_at_time) as revenue
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    GROUP BY p.category
    ORDER BY revenue DESC
  `);
  return result.rows;
}

async function getTopProducts() {
  // Finds the 5 most sold products (Bar Chart)
  const result = await db.query(`
    SELECT p.name, SUM(oi.quantity) as units_sold
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    GROUP BY p.id, p.name
    ORDER BY units_sold DESC
    LIMIT 5
  `);
  return result.rows;
}

async function getOrderStatusDistribution() {
  // Counts how many orders are in each status (Pie Chart)
  const result = await db.query(`
    SELECT status, COUNT(*) as count
    FROM orders
    GROUP BY status
  `);
  return result.rows;
}

async function getSummaryStats() {
  // Quick KPI cards (Total Revenue, Total Orders, etc.)
  const result = await db.query(`
    SELECT 
      (SELECT SUM(total) FROM orders) as total_revenue,
      (SELECT COUNT(*) FROM orders) as total_orders,
      (SELECT COUNT(*) FROM users WHERE role = 'customer') as total_customers
  `);
  return result.rows[0];
}

module.exports = {
  getSalesOverTime,
  getRevenueByCategory,
  getTopProducts,
  getOrderStatusDistribution,
  getSummaryStats,
};
