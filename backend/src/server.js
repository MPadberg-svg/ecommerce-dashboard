const app = require('./app');
const env = require('./config/env');

const PORT = env.port || 5000;
const HOST = '0.0.0.0'; // Essential for Docker mapping

const server = app.listen(PORT, HOST, () => {
  console.log(`
🚀 Server ready at: http://localhost:${PORT}
🌍 Mode: ${env.nodeEnv}
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});