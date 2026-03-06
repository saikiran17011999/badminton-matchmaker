const roundService = require('../services/roundService');
const { success, error, notFound } = require('../utils/responseHelpers');

const generateRound = (req, res) => {
  try {
    const { eventId } = req.params;
    const result = roundService.generateRound(eventId);

    if (result.error) {
      return error(res, result.error, 'GENERATION_ERROR');
    }

    return success(res, result, 201);
  } catch (err) {
    return error(res, err.message);
  }
};

const getRound = (req, res) => {
  try {
    const { eventId, roundNumber } = req.params;
    const round = roundService.getRound(eventId, parseInt(roundNumber));

    if (!round) {
      return notFound(res, 'Round');
    }

    return success(res, round);
  } catch (err) {
    return error(res, err.message);
  }
};

module.exports = {
  generateRound,
  getRound
};
