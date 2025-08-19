const { verifyToken } = require('../utils/jwt');

function extractBearerToken(authorization) {
  if (!authorization) return null;
  const parts = authorization.split(' ');
  if (parts.length !== 2) return null;
  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) return null;
  return token;
}

// PUBLIC_INTERFACE
function attachUser(req, res, next) {
  /**
   * Global middleware that parses the Authorization header if present.
   * If a valid Bearer token is provided, it attaches the decoded user to req.user.
   * This middleware never blocks the request; invalid tokens are ignored.
   */
  try {
    const token = extractBearerToken(req.headers.authorization);
    if (token) {
      const decoded = verifyToken(token);
      req.user = decoded;
    }
  } catch {
    // ignore invalid/expired tokens
    req.user = undefined;
  }
  next();
}

// PUBLIC_INTERFACE
function requireAuth(req, res, next) {
  /**
   * Route guard middleware that requires an authenticated user.
   * Returns 401 Unauthorized if req.user is not present.
   */
  if (!req.user) {
    return res.status(401).json({
      status: 'unauthorized',
      message: 'Authentication required',
    });
  }
  return next();
}

module.exports = {
  attachUser,
  requireAuth,
};
