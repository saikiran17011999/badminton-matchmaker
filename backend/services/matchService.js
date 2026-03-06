const Match = require('../models/Match');
const Player = require('../models/Player');
const ratingSystem = require('../../matchmaking/ratingSystem');

const updateMatchScore = (matchId, { team1Score, team2Score }) => {
  const match = Match.findById(matchId);
  if (!match) return null;

  if (match.status === 'completed') {
    return { error: 'Match already completed' };
  }

  const updatedMatch = Match.updateScore(matchId, { team1Score, team2Score });

  const team1PlayerData = match.team1Players.map(p => Player.findById(p.id));
  const team2PlayerData = match.team2Players.map(p => Player.findById(p.id));

  const ratingChanges = ratingSystem.calculateNewRatings(
    team1PlayerData,
    team2PlayerData,
    team1Score,
    team2Score
  );

  ratingChanges.forEach(({ playerId, newRating }) => {
    Player.updateRating(playerId, newRating);
  });

  return updatedMatch;
};

const swapPlayers = (eventId, roundNumber, player1Id, player2Id) => {
  const matches = Match.findByEventAndRound(eventId, roundNumber);

  let player1Match = null;
  let player1Team = null;
  let player1Index = -1;
  let player2Match = null;
  let player2Team = null;
  let player2Index = -1;

  for (const match of matches) {
    const t1Idx = match.team1Players.findIndex(p => p.id === player1Id);
    if (t1Idx !== -1) {
      player1Match = match;
      player1Team = 'team1';
      player1Index = t1Idx;
    }
    const t2Idx = match.team2Players.findIndex(p => p.id === player1Id);
    if (t2Idx !== -1) {
      player1Match = match;
      player1Team = 'team2';
      player1Index = t2Idx;
    }

    const t1Idx2 = match.team1Players.findIndex(p => p.id === player2Id);
    if (t1Idx2 !== -1) {
      player2Match = match;
      player2Team = 'team1';
      player2Index = t1Idx2;
    }
    const t2Idx2 = match.team2Players.findIndex(p => p.id === player2Id);
    if (t2Idx2 !== -1) {
      player2Match = match;
      player2Team = 'team2';
      player2Index = t2Idx2;
    }
  }

  if (!player1Match || !player2Match) {
    return { error: 'One or both players not found in current round matches' };
  }

  const player1Data = player1Team === 'team1'
    ? player1Match.team1Players[player1Index]
    : player1Match.team2Players[player1Index];
  const player2Data = player2Team === 'team1'
    ? player2Match.team1Players[player2Index]
    : player2Match.team2Players[player2Index];

  if (player1Match.id === player2Match.id) {
    const team1Players = [...player1Match.team1Players];
    const team2Players = [...player1Match.team2Players];

    if (player1Team === 'team1') team1Players[player1Index] = player2Data;
    else team2Players[player1Index] = player2Data;

    if (player2Team === 'team1') team1Players[player2Index] = player1Data;
    else team2Players[player2Index] = player1Data;

    Match.updatePlayers(player1Match.id, { team1Players, team2Players });
  } else {
    const match1Team1 = [...player1Match.team1Players];
    const match1Team2 = [...player1Match.team2Players];
    const match2Team1 = [...player2Match.team1Players];
    const match2Team2 = [...player2Match.team2Players];

    if (player1Team === 'team1') match1Team1[player1Index] = player2Data;
    else match1Team2[player1Index] = player2Data;

    if (player2Team === 'team1') match2Team1[player2Index] = player1Data;
    else match2Team2[player2Index] = player1Data;

    Match.updatePlayers(player1Match.id, { team1Players: match1Team1, team2Players: match1Team2 });
    Match.updatePlayers(player2Match.id, { team1Players: match2Team1, team2Players: match2Team2 });
  }

  return { success: true };
};

const getMatchesByRound = (eventId, roundNumber) => {
  return Match.findByEventAndRound(eventId, roundNumber);
};

module.exports = {
  updateMatchScore,
  swapPlayers,
  getMatchesByRound
};
