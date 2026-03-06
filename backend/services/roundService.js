const Event = require('../models/Event');
const Player = require('../models/Player');
const Match = require('../models/Match');
const Round = require('../models/Round');
const matchmakingEngine = require('../../matchmaking/matchmakingEngine');

const generateRound = (eventId) => {
  const event = Event.findById(eventId);
  if (!event) return { error: 'Event not found' };

  const players = Player.findByEventId(eventId);
  const requiredPlayers = event.type === 'doubles' ? 4 : 2;

  if (players.length < requiredPlayers) {
    return {
      error: `Not enough players. Need at least ${requiredPlayers} for ${event.type}.`
    };
  }

  const newRoundNumber = event.currentRound + 1;

  const { matches: generatedMatches, restingPlayers } = matchmakingEngine.generateRound(
    players,
    event.numCourts,
    event.type
  );

  Round.create({
    eventId,
    roundNumber: newRoundNumber,
    restingPlayers: restingPlayers.map(p => ({ id: p.id, name: p.name }))
  });

  const createdMatches = generatedMatches.map((match, index) => {
    const created = Match.create({
      eventId,
      roundNumber: newRoundNumber,
      courtNumber: index + 1,
      team1Players: match.team1.map(p => ({ id: p.id, name: p.name, rating: p.rating })),
      team2Players: match.team2.map(p => ({ id: p.id, name: p.name, rating: p.rating }))
    });

    match.team1.forEach(p => Player.incrementMatchesPlayed(p.id));
    match.team2.forEach(p => Player.incrementMatchesPlayed(p.id));

    return created;
  });

  Event.updateCurrentRound(eventId, newRoundNumber);

  return {
    roundNumber: newRoundNumber,
    matches: createdMatches,
    restingPlayers: restingPlayers.map(p => ({ id: p.id, name: p.name }))
  };
};

const getRound = (eventId, roundNumber) => {
  const round = Round.findByEventAndNumber(eventId, roundNumber);
  if (!round) return null;

  const matches = Match.findByEventAndRound(eventId, roundNumber);

  return {
    ...round,
    matches
  };
};

module.exports = {
  generateRound,
  getRound
};
