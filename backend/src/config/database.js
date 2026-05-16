const { Pool } = require('pg');
const env = require('./env');

const pool = new Pool({
  connectionString: env.databaseUrl,
  // Add a slight timeout so it doesn't hang forever if the DB is down
  connectionTimeoutMillis: 5000,
  ssl: env.nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
});

// Simple connection test
pool.on('connect', () => {
  console.log('🐘 PostgreSQL connected successfully');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};