const dotenv = require('dotenv');

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',

  port: Number(process.env.PORT || 5000),

  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  // In Docker, the host is 'postgres' (the service name), not 'localhost'
  databaseUrl:
    process.env.DATABASE_URL || 'postgresql://postgres:postgres@postgres:5432/ecommerce_dashboard',

  // SECURITY: Require JWT_SECRET in production. Crash on startup if missing.
  jwtSecret: (() => {
    const secret = process.env.JWT_SECRET;
    if (!secret && process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: JWT_SECRET environment variable is required in production');
    }
    return secret || 'dev-only-jwt-secret-never-use-in-production';
  })(),

  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
};

module.exports = env;
