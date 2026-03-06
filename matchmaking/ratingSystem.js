const K_FACTOR = 32;
const BASE_RATING = 1000;

const calculateExpectedScore = (playerRating, opponentRating) => {
  return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
};

const getScoreModifier = (winnerScore, loserScore) => {
  const diff = winnerScore - loserScore;
  return 1 + (diff * 0.03);
};

const calculateNewRatings = (team1Players, team2Players, team1Score, team2Score) => {
  const team1AvgRating = team1Players.reduce((sum, p) => sum + p.rating, 0) / team1Players.length;
  const team2AvgRating = team2Players.reduce((sum, p) => sum + p.rating, 0) / team2Players.length;

  const team1Won = team1Score > team2Score;
  const team1ActualScore = team1Won ? 1 : (team1Score === team2Score ? 0.5 : 0);
  const team2ActualScore = 1 - team1ActualScore;

  const team1Expected = calculateExpectedScore(team1AvgRating, team2AvgRating);
  const team2Expected = 1 - team1Expected;

  const modifier = team1Won
    ? getScoreModifier(team1Score, team2Score)
    : getScoreModifier(team2Score, team1Score);

  const team1Change = K_FACTOR * (team1ActualScore - team1Expected) * modifier;
  const team2Change = K_FACTOR * (team2ActualScore - team2Expected) * modifier;

  const ratingChanges = [];

  team1Players.forEach(player => {
    ratingChanges.push({
      playerId: player.id,
      oldRating: player.rating,
      newRating: Math.max(100, player.rating + team1Change),
      change: team1Change
    });
  });

  team2Players.forEach(player => {
    ratingChanges.push({
      playerId: player.id,
      oldRating: player.rating,
      newRating: Math.max(100, player.rating + team2Change),
      change: team2Change
    });
  });

  return ratingChanges;
};

const getInitialRating = () => BASE_RATING;

module.exports = {
  calculateNewRatings,
  calculateExpectedScore,
  getInitialRating,
  K_FACTOR,
  BASE_RATING
};
