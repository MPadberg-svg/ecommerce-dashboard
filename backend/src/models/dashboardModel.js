const pool = require('../config/database');

async function getDashboardStats() {
  const salesOverTimeQuery = `
    SELECT TO_CHAR(date_series.day, 'YYYY-MM-DD') AS date,
           COALESCE(COUNT(o.id), 0)::int AS orders,
           COALESCE(SUM(o.total), 0)::float AS revenue
    FROM generate_series(CURRENT_DATE - INTERVAL '29 days', CURRENT_DATE, INTERVAL '1 day') AS date_series(day)
    LEFT JOIN orders o ON DATE(o.created_at) = DATE(date_series.day)
    GROUP BY date_series.day
    ORDER BY date_series.day;
  `;

  const revenueByCategoryQuery = `
    SELECT p.category,
           COALESCE(SUM(oi.quantity * oi.price), 0)::float AS revenue
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    GROUP BY p.category
    ORDER BY revenue DESC;
  `;

  const topProductsQuery = `
    SELECT p.id, p.name,
           COALESCE(SUM(oi.quantity), 0)::int AS quantity_sold
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    GROUP BY p.id, p.name
    ORDER BY quantity_sold DESC
    LIMIT 5;
  `;

  const orderStatusQuery = `
    SELECT status, COUNT(*)::int AS count
    FROM orders
    GROUP BY status
    ORDER BY status;
  `;

  const [salesOverTime, revenueByCategory, topProducts, orderStatus] = await Promise.all([
    pool.query(salesOverTimeQuery),
    pool.query(revenueByCategoryQuery),
    pool.query(topProductsQuery),
    pool.query(orderStatusQuery),
  ]);

  return {
    salesOverTime: salesOverTime.rows,
    revenueByCategory: revenueByCategory.rows,
    topProducts: topProducts.rows,
    orderStatus: orderStatus.rows,
  };
}

module.exports = { getDashboardStats };
