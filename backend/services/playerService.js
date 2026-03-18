const Player = require('../models/Player');
const Event = require('../models/Event');

const addPlayer = (eventId, { name }) => {
  const event = Event.findById(eventId);
  if (!event) return { error: 'Event not found' };

  // Use join baseline (set when round is generated) to prevent cascade
  // Multiple players joining mid-round all get the same baseline - 1
  const baseline = Event.getJoinBaseline(eventId);
  const adjustedMatches = Math.max(0, baseline - 1);

  const player = Player.create({
    eventId,
    name,
    matchesPlayed: adjustedMatches
  });

  return player;
};

const updatePlayer = (playerId, { name }) => {
  const player = Player.findById(playerId);
  if (!player) return null;

  return Player.update(playerId, { name });
};

const removePlayer = (playerId) => {
  const player = Player.findById(playerId);
  if (!player) return null;

  Player.delete(playerId);
  return player;
};

const getPlayers = (eventId) => {
  const players = Player.findByEventId(eventId);
  // Add actual matches count (from matches table) for each player
  return players.map(player => ({
    ...player,
    actualMatchesPlayed: Player.countActualMatches(eventId, player.id)
  }));
};

module.exports = {
  addPlayer,
  updatePlayer,
  removePlayer,
  getPlayers
};
