const selectPlayersForRound = (players, numCourts, eventType) => {
  const playersPerMatch = eventType === 'doubles' ? 4 : 2;
  const maxPlayers = numCourts * playersPerMatch;

  const shuffled = [...players].sort(() => Math.random() - 0.5);

  const sorted = shuffled.sort((a, b) => a.matchesPlayed - b.matchesPlayed);

  const selectedCount = Math.min(maxPlayers, players.length);
  const actualMatches = Math.floor(selectedCount / playersPerMatch);
  const actualSelected = actualMatches * playersPerMatch;

  const selectedPlayers = sorted.slice(0, actualSelected);
  const restingPlayers = sorted.slice(actualSelected);

  return {
    selectedPlayers,
    restingPlayers
  };
};

module.exports = {
  selectPlayersForRound
};
