require('dotenv').config();

const required = ['MONGO_URI', 'JWT_SECRET'];

if (process.env.NODE_ENV !== 'test') {
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}

module.exports = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET || 'test-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  // Comma-separated list of allowed CORS origins in addition to localhost
  // (app.js always allows localhost/127.0.0.1). Set this to the deployed
  // frontend URL in production, e.g. https://ajaia-delta.vercel.app
  clientOrigins: (process.env.CLIENT_ORIGIN || '')
    .split(',')
    .map((o) => o.trim().replace(/\/$/, ''))
    .filter(Boolean),
  maxUploadSizeBytes: Number(process.env.MAX_UPLOAD_SIZE_BYTES) || 5 * 1024 * 1024,
};
