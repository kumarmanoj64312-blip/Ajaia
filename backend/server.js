const app = require('./app');
const connectDB = require('./src/config/db');
const env = require('./src/config/env');

async function start() {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`API server listening on port ${env.port} (${env.nodeEnv})`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
