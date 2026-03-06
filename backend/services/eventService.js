const Event = require('../models/Event');
const Player = require('../models/Player');
const Match = require('../models/Match');
const Round = require('../models/Round');

const createEvent = ({ type, numCourts, playerNames = [] }) => {
  const event = Event.create({ type, numCourts });

  const players = playerNames.map(name => Player.create({
    eventId: event.id,
    name
  }));

  return {
    ...event,
    players
  };
};

const getEvent = (eventId) => {
  const event = Event.findById(eventId);
  if (!event) return null;

  const players = Player.findByEventId(eventId);
  const rounds = Round.findByEventId(eventId);

  let currentRoundData = null;
  if (event.currentRound > 0) {
    const matches = Match.findByEventAndRound(eventId, event.currentRound);
    const round = Round.findByEventAndNumber(eventId, event.currentRound);
    currentRoundData = {
      roundNumber: event.currentRound,
      matches,
      restingPlayers: round?.restingPlayers || []
    };
  }

  return {
    ...event,
    players,
    totalRounds: rounds.length,
    currentRoundData
  };
};

const deleteEvent = (eventId) => {
  return Event.delete(eventId);
};

module.exports = {
  createEvent,
  getEvent,
  deleteEvent
};
