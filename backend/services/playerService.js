const Player = require('../models/Player');
const Event = require('../models/Event');

const addPlayer = (eventId, { name }) => {
  const event = Event.findById(eventId);
  if (!event) return { error: 'Event not found' };

  const minMatches = Player.getMinMatchesPlayed(eventId);

  const player = Player.create({
    eventId,
    name,
    matchesPlayed: minMatches
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
  return Player.findByEventId(eventId);
};

module.exports = {
  addPlayer,
  updatePlayer,
  removePlayer,
  getPlayers
};
