const eventService = require('../services/eventService');

/**
 * Middleware to verify organiser token for protected operations.
 * Checks ?token query param or x-admin-token header against event's admin token.
 */
const requireOrganiser = (req, res, next) => {
  const eventId = req.params.eventId;
  const token = req.query.token || req.headers['x-admin-token'];

  if (!token) {
    return res.status(403).json({
      error: 'Admin token required for this operation',
      code: 'UNAUTHORIZED'
    });
  }

  if (!eventService.verifyOrganiser(eventId, token)) {
    return res.status(403).json({
      error: 'Invalid admin token',
      code: 'FORBIDDEN'
    });
  }

  // Token valid, proceed
  req.isOrganiser = true;
  next();
};

module.exports = requireOrganiser;
