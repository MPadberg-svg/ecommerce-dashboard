const dotenv = require('dotenv');

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',

  port: Number(process.env.PORT || 5000),

  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  // In Docker, the host is 'postgres' (the service name), not 'localhost'

  databaseUrl:
    process.env.DATABASE_URL || 'postgresql://postgres:postgres@postgres:5432/ecommerce_dashboard',

  jwtSecret: process.env.JWT_SECRET || 'super-secret-dashboard-key-2026',

  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
};

module.exports = env;
