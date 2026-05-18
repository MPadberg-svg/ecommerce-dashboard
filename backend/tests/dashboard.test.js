/* global require, jest, describe, beforeEach, it, expect */

const request = require('supertest');
const app = require('../src/app');

// Mock the authentication middleware to isolate unit routing tests
jest.mock('../src/middleware/auth', () => ({
  authenticate: (req, res, next) => {
    req.user = { id: 1, role: 'admin', email: 'admin@dashboard.com' };
    next();
  },
  requireRole: () => (req, res, next) => next(),
}));

// Mock each granular data collection method called by your controller layer
jest.mock('../src/models/dashboardModel', () => ({
  getSummaryStats: jest.fn().mockResolvedValue({
    total_revenue: "5000.00",
    total_orders: "10",
    total_customers: "5"
  }),
  getSalesOverTime: jest.fn().mockResolvedValue([
    { date: "2026-05-18", daily_revenue: "500.00" }
  ]),
  getRevenueByCategory: jest.fn().mockResolvedValue([
    { category: "Electronics", revenue: "5000.00" }
  ]),
  getTopProducts: jest.fn().mockResolvedValue([
    { name: "Test Product", units_sold: "5" }
  ]),
  getOrderStatusDistribution: jest.fn().mockResolvedValue([ // <-- Fixed the method name here!
    { status: "Delivered", count: "10" }
  ])
}));

describe('📊 Dashboard API Integration Suite', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/dashboard/stats', () => {
    it('should successfully intercept requests and yield a structured telemetry payload', async () => {
      const response = await request(app)
        .get('/api/dashboard/stats')
        .expect('Content-Type', /json/)
        .expect(200);

      // Extract body whether it's direct or wrapped inside an envelope object (e.g. { data: {...} })
      const body = response.body.data || response.body;

      // Assert data payload schema compliance
      expect(body).toHaveProperty('summary');
      expect(body).toHaveProperty('charts');
      
      // Assert specific nested properties match our mock profiles
      expect(body.summary.total_revenue).toBe("5000.00");
      expect(body.charts.salesOverTime).toBeInstanceOf(Array);
      expect(body.charts.topProducts[0].name).toBe("Test Product");
    });
  });
});