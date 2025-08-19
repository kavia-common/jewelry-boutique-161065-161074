const { randomUUID } = require('crypto');

// PUBLIC_INTERFACE
function requestContext(req, res, next) {
  /**
   * Global middleware to attach a request context and perform lightweight logging.
   * Adds:
   *   - req.context: { id, startedAt }
   *   - req.requestId: string
   */
  const id = typeof randomUUID === 'function' ? randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const startedAt = Date.now();

  req.context = { id, startedAt };
  req.requestId = id;

  res.setHeader('X-Request-Id', id);

  res.on('finish', () => {
    const ms = Date.now() - startedAt;
    // Basic access log line
    // Example: 123e4567 GET /health 200 12ms
    console.log(`${id} ${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
  });

  next();
}

module.exports = { requestContext };
