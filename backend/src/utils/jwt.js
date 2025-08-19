const jwt = require('jsonwebtoken');

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set in environment variables');
  }
  return secret;
}

// PUBLIC_INTERFACE
function signToken(payload, options = {}) {
  /**
   * Sign a JWT token using the configured secret.
   * Params:
   *   - payload: object - data to embed in the token
   *   - options: object - jsonwebtoken sign options (overrides default expiresIn)
   * Environment:
   *   - JWT_EXPIRES_IN: default expiration (e.g., "1h")
   * Returns:
   *   - string - signed JWT token
   */
  const expiresIn = options.expiresIn || process.env.JWT_EXPIRES_IN || '1h';
  const secret = getSecret();
  return jwt.sign(payload, secret, { ...options, expiresIn });
}

// PUBLIC_INTERFACE
function verifyToken(token) {
  /**
   * Verify a JWT token and return the decoded payload.
   * Params:
   *   - token: string - Bearer token without the "Bearer " prefix
   * Returns:
   *   - object - decoded payload
   * Throws:
   *   - Error if token is invalid or expired
   */
  const secret = getSecret();
  return jwt.verify(token, secret);
}

// PUBLIC_INTERFACE
function decodeToken(token) {
  /**
   * Decode a JWT token without verifying the signature.
   * Params:
   *   - token: string
   * Returns:
   *   - object|null - decoded payload or null if invalid
   */
  try {
    return jwt.decode(token) || null;
  } catch {
    return null;
  }
}

module.exports = {
  signToken,
  verifyToken,
  decodeToken,
};
