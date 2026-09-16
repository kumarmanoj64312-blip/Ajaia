const express = require('express');
const cors = require('cors');
const env = require('./src/config/env');
const authRoutes = require('./src/routes/auth.routes');
const documentRoutes = require('./src/routes/document.routes');
const uploadRoutes = require('./src/routes/upload.routes');
const { notFoundHandler, errorHandler } = require('./src/middlewares/error.middleware');

const app = express();

// Any localhost/127.0.0.1 port is always allowed — this covers local dev
// (Vite drifts to the next free port: 5173, 5174, ...) and lets a local
// frontend talk to the deployed backend. Everything else must be explicitly
// listed in CLIENT_ORIGIN (comma-separated), e.g. the deployed Vercel URL.
const localhostOrigin = /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/;

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true); // same-origin / curl / server-to-server
    const normalized = origin.replace(/\/$/, '');
    if (localhostOrigin.test(normalized) || env.clientOrigins.includes(normalized)) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // explicit preflight handling for every route
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/uploads', uploadRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
