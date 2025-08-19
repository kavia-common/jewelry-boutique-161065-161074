require('dotenv').config();
const cors = require('cors');
const express = require('express');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');
const { requestContext, attachUser } = require('./middleware');
const migrations = require('./db/migrations');

// Initialize express app
const app = express();

// Kick off lightweight migrations (non-blocking)
try {
  migrations.run().catch((e) => {
    console.warn('Migrations failed or skipped:', e.message);
  });
} catch (e) {
  console.warn('Migrations initialization error:', e.message);
}

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.set('trust proxy', true);

// Helper to create dynamic OpenAPI spec with correct server URL
function buildDynamicSpec(req) {
  const host = req.get('host'); // may or may not include port
  let protocol = req.protocol;  // http or https
  const actualPort = req.socket.localPort;
  const hasPort = host.includes(':');

  const needsPort =
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) ||
      (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;
  protocol = req.secure ? 'https' : protocol;

  return {
    ...swaggerSpec,
    servers: [
      {
        url: `${protocol}://${fullHost}`,
      },
    ],
  };
}

app.use('/docs', swaggerUi.serve, (req, res, next) => {
  const dynamicSpec = buildDynamicSpec(req);
  swaggerUi.setup(dynamicSpec)(req, res, next);
});

// Expose OpenAPI JSON
app.get('/openapi.json', (req, res) => {
  const dynamicSpec = buildDynamicSpec(req);
  res.json(dynamicSpec);
});

// Parse JSON request body
app.use(express.json());

// Global middleware
app.use(requestContext);
app.use(attachUser);

// Mount routes
app.use('/', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

module.exports = app;
