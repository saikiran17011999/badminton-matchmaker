const playerService = require('../services/playerService');
const { success, error, notFound } = require('../utils/responseHelpers');

const addPlayer = (req, res) => {
  try {
    const { eventId } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return error(res, 'Player name is required', 'INVALID_NAME');
    }

    const result = playerService.addPlayer(eventId, { name: name.trim() });

    if (result.error) {
      return error(res, result.error);
    }

    return success(res, result, 201);
  } catch (err) {
    return error(res, err.message);
  }
};

const updatePlayer = (req, res) => {
  try {
    const { playerId } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return error(res, 'Player name is required', 'INVALID_NAME');
    }

    const player = playerService.updatePlayer(playerId, { name: name.trim() });

    if (!player) {
      return notFound(res, 'Player');
    }

    return success(res, player);
  } catch (err) {
    return error(res, err.message);
  }
};

const removePlayer = (req, res) => {
  try {
    const { playerId } = req.params;
    const player = playerService.removePlayer(playerId);

    if (!player) {
      return notFound(res, 'Player');
    }

    return success(res, { message: 'Player removed successfully' });
  } catch (err) {
    return error(res, err.message);
  }
};

const getPlayers = (req, res) => {
  try {
    const { eventId } = req.params;
    const players = playerService.getPlayers(eventId);
    return success(res, players);
  } catch (err) {
    return error(res, err.message);
  }
};

module.exports = {
  addPlayer,
  updatePlayer,
  removePlayer,
  getPlayers
};
