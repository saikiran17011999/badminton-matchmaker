const matchService = require('../services/matchService');
const { success, error, notFound } = require('../utils/responseHelpers');

const updateMatchScore = (req, res) => {
  try {
    const { matchId } = req.params;
    const { team1Score, team2Score } = req.body;

    if (team1Score === undefined || team2Score === undefined) {
      return error(res, 'Both team scores are required', 'INVALID_SCORES');
    }

    if (team1Score < 0 || team2Score < 0) {
      return error(res, 'Scores cannot be negative', 'INVALID_SCORES');
    }

    const result = matchService.updateMatchScore(matchId, { team1Score, team2Score });

    if (!result) {
      return notFound(res, 'Match');
    }

    if (result.error) {
      return error(res, result.error);
    }

    return success(res, result);
  } catch (err) {
    return error(res, err.message);
  }
};

const swapPlayers = (req, res) => {
  try {
    const { eventId } = req.params;
    const { player1Id, player2Id, roundNumber } = req.body;

    if (!player1Id || !player2Id) {
      return error(res, 'Both player IDs are required', 'INVALID_PLAYERS');
    }

    if (player1Id === player2Id) {
      return error(res, 'Cannot swap player with themselves', 'INVALID_SWAP');
    }

    const result = matchService.swapPlayers(eventId, roundNumber, player1Id, player2Id);

    if (result.error) {
      return error(res, result.error, 'INVALID_SWAP');
    }

    return success(res, result);
  } catch (err) {
    return error(res, err.message);
  }
};

module.exports = {
  updateMatchScore,
  swapPlayers
};
