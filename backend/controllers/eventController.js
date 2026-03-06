const eventService = require('../services/eventService');
const { success, error, notFound } = require('../utils/responseHelpers');

const createEvent = (req, res) => {
  try {
    const { type, numCourts, playerNames } = req.body;

    if (!type || !['singles', 'doubles'].includes(type)) {
      return error(res, 'Invalid event type. Must be "singles" or "doubles"', 'INVALID_TYPE');
    }

    if (!numCourts || numCourts < 1) {
      return error(res, 'Number of courts must be at least 1', 'INVALID_COURTS');
    }

    const event = eventService.createEvent({ type, numCourts, playerNames });
    return success(res, event, 201);
  } catch (err) {
    return error(res, err.message);
  }
};

const getEvent = (req, res) => {
  try {
    const { eventId } = req.params;
    const event = eventService.getEvent(eventId);

    if (!event) {
      return notFound(res, 'Event');
    }

    return success(res, event);
  } catch (err) {
    return error(res, err.message);
  }
};

const deleteEvent = (req, res) => {
  try {
    const { eventId } = req.params;
    const result = eventService.deleteEvent(eventId);

    if (result.changes === 0) {
      return notFound(res, 'Event');
    }

    return success(res, { message: 'Event deleted successfully' });
  } catch (err) {
    return error(res, err.message);
  }
};

module.exports = {
  createEvent,
  getEvent,
  deleteEvent
};
