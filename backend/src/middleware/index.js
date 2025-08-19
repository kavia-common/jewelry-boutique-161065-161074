const { requestContext } = require('./requestContext');
const { attachUser, requireAuth } = require('./auth');

// This file exports global and route-specific middleware
module.exports = {
  requestContext,
  attachUser,
  requireAuth,
};
