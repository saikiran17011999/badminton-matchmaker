const { getTeamAverageRating } = require('./teamFormation');

const RANDOMNESS_FACTOR = 0.1;

const pairTeams = (teams) => {
  if (teams.length < 2) {
    throw new Error('Need at least 2 teams to create matches');
  }

  const teamsWithRatings = teams.map(team => ({
    team,
    avgRating: getTeamAverageRating(team)
  }));

  teamsWithRatings.sort((a, b) => b.avgRating - a.avgRating);

  if (Math.random() < RANDOMNESS_FACTOR && teamsWithRatings.length >= 4) {
    const idx = Math.floor(Math.random() * (teamsWithRatings.length - 1));
    [teamsWithRatings[idx], teamsWithRatings[idx + 1]] =
      [teamsWithRatings[idx + 1], teamsWithRatings[idx]];
  }

  const matches = [];
  for (let i = 0; i < teamsWithRatings.length - 1; i += 2) {
    matches.push({
      team1: teamsWithRatings[i].team,
      team2: teamsWithRatings[i + 1].team,
      team1AvgRating: teamsWithRatings[i].avgRating,
      team2AvgRating: teamsWithRatings[i + 1].avgRating
    });
  }

  return matches;
};

const pairSingles = (players) => {
  const sorted = [...players].sort((a, b) => b.rating - a.rating);

  if (Math.random() < RANDOMNESS_FACTOR && sorted.length >= 4) {
    const idx = Math.floor(Math.random() * (sorted.length - 1));
    [sorted[idx], sorted[idx + 1]] = [sorted[idx + 1], sorted[idx]];
  }

  const matches = [];
  for (let i = 0; i < sorted.length - 1; i += 2) {
    matches.push({
      team1: [sorted[i]],
      team2: [sorted[i + 1]],
      team1AvgRating: sorted[i].rating,
      team2AvgRating: sorted[i + 1].rating
    });
  }

  return matches;
};

module.exports = {
  pairTeams,
  pairSingles
};
