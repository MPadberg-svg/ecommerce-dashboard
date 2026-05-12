const pool = require('../config/database');

async function waitForDb() {
  const retries = Number(process.env.DB_WAIT_RETRIES || 30);
  const delayMs = Number(process.env.DB_WAIT_DELAY_MS || 2000);

  for (let i = 1; i <= retries; i += 1) {
    try {
      await pool.query('SELECT 1');
      await pool.end();
      console.log('Database is ready');
      return;
    } catch {
      console.log(`Waiting for database (${i}/${retries})...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  await pool.end();
  throw new Error('Database did not become ready in time');
}

waitForDb().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
