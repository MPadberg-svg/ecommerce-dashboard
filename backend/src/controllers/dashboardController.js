const dashboardModel = require('../models/dashboardModel');

async function getDashboardStats(req, res, next) {
  try {
    // Run all database queries simultaneously for maximum performance
    const [summary, salesOverTime, revenueByCategory, topProducts, orderStatus] = await Promise.all(
      [
        dashboardModel.getSummaryStats(),
        dashboardModel.getSalesOverTime(),
        dashboardModel.getRevenueByCategory(),
        dashboardModel.getTopProducts(),
        dashboardModel.getOrderStatusDistribution(),
      ],
    );

    return res.json({
      summary,
      charts: {
        salesOverTime,
        revenueByCategory,
        topProducts,
        orderStatus,
      },
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    return next(error);
  }
}

module.exports = { getDashboardStats };
