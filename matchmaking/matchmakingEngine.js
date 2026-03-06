const { selectPlayersForRound } = require('./playerSelection');
const { formTeams, formSinglesPlayers } = require('./teamFormation');
const { pairTeams, pairSingles } = require('./matchPairing');

const generateRound = (players, numCourts, eventType) => {
  const { selectedPlayers, restingPlayers } = selectPlayersForRound(
    players,
    numCourts,
    eventType
  );

  if (selectedPlayers.length === 0) {
    return {
      matches: [],
      restingPlayers: players
    };
  }

  let matches;

  if (eventType === 'doubles') {
    const teams = formTeams(selectedPlayers);
    matches = pairTeams(teams);
  } else {
    matches = pairSingles(selectedPlayers);
  }

  return {
    matches,
    restingPlayers
  };
};

const validateRoundGeneration = (players, numCourts, eventType) => {
  const minPlayers = eventType === 'doubles' ? 4 : 2;

  if (players.length < minPlayers) {
    return {
      valid: false,
      error: `Need at least ${minPlayers} players for ${eventType}`
    };
  }

  return { valid: true };
};

module.exports = {
  generateRound,
  validateRoundGeneration
};
