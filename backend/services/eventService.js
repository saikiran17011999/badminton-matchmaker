const Event = require('../models/Event');
const Player = require('../models/Player');
const Match = require('../models/Match');
const Round = require('../models/Round');

const createEvent = ({ type, numCourts, playerNames = [] }) => {
  // Event.create returns event with adminToken
  const event = Event.create({ type, numCourts });

  const players = playerNames.map(name => Player.create({
    eventId: event.id,
    name
  }));

  // Return full event including adminToken for organiser
  return {
    ...event,
    players
  };
};

const getEvent = (eventId, adminToken = null) => {
  const event = Event.findById(eventId);
  if (!event) return null;

  // Determine role based on admin token
  const isOrganiser = adminToken && Event.verifyAdminToken(eventId, adminToken);
  const role = isOrganiser ? 'organiser' : 'viewer';

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
    currentRoundData,
    role // Include role in response
  };
};

// Verify admin token for protected operations
const verifyOrganiser = (eventId, adminToken) => {
  return Event.verifyAdminToken(eventId, adminToken);
};

// Get event by share code
const getEventByShareCode = (shareCode) => {
  return Event.findByShareCode(shareCode);
};

const deleteEvent = (eventId) => {
  return Event.delete(eventId);
};

module.exports = {
  createEvent,
  getEvent,
  deleteEvent,
  verifyOrganiser,
  getEventByShareCode
};
