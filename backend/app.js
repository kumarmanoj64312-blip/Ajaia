const express = require('express');
const cors = require('cors');
const env = require('./src/config/env');
const authRoutes = require('./src/routes/auth.routes');
const documentRoutes = require('./src/routes/document.routes');
const uploadRoutes = require('./src/routes/upload.routes');
const { notFoundHandler, errorHandler } = require('./src/middlewares/error.middleware');

const app = express();

// In dev, Vite drifts to the next free port (5173, 5174, ...) whenever the
// configured one is taken, so pin CORS to localhost/127.0.0.1 on any port
// rather than one hardcoded value. In production, only the exact configured
// origin(s) are allowed.
const localhostDevOrigin = /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true); // same-origin / curl / server-to-server
      if (env.nodeEnv !== 'production' && localhostDevOrigin.test(origin)) {
        return callback(null, true);
      }
      if (env.clientOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/uploads', uploadRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
