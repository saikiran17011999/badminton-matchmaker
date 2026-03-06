const formTeams = (players) => {
  if (players.length < 4) {
    throw new Error('Need at least 4 players for doubles');
  }

  const sorted = [...players].sort((a, b) => b.rating - a.rating);

  const teams = [];
  const used = new Set();

  while (used.size < sorted.length - 1) {
    let highestUnused = null;
    for (const player of sorted) {
      if (!used.has(player.id)) {
        highestUnused = player;
        break;
      }
    }

    if (!highestUnused) break;

    let lowestUnused = null;
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (!used.has(sorted[i].id) && sorted[i].id !== highestUnused.id) {
        lowestUnused = sorted[i];
        break;
      }
    }

    if (!lowestUnused) break;

    teams.push([highestUnused, lowestUnused]);
    used.add(highestUnused.id);
    used.add(lowestUnused.id);
  }

  return teams;
};

const formSinglesPlayers = (players) => {
  return players.map(player => [player]);
};

const getTeamAverageRating = (team) => {
  return team.reduce((sum, p) => sum + p.rating, 0) / team.length;
};

module.exports = {
  formTeams,
  formSinglesPlayers,
  getTeamAverageRating
};
