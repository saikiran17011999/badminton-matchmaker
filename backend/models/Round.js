const db = require('./database');
const { generateRoundId } = require('../utils/idGenerator');

class Round {
  static create({ eventId, roundNumber, restingPlayers = [] }) {
    const id = generateRoundId();
    const stmt = db.prepare(`
      INSERT INTO rounds (id, event_id, round_number, resting_players)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(id, eventId, roundNumber, JSON.stringify(restingPlayers));
    return this.findByEventAndNumber(eventId, roundNumber);
  }

  static findByEventAndNumber(eventId, roundNumber) {
    const stmt = db.prepare(`
      SELECT * FROM rounds WHERE event_id = ? AND round_number = ?
    `);
    const round = stmt.get(eventId, roundNumber);
    if (!round) return null;
    return this.format(round);
  }

  static findByEventId(eventId) {
    const stmt = db.prepare('SELECT * FROM rounds WHERE event_id = ? ORDER BY round_number');
    const rounds = stmt.all(eventId);
    return rounds.map(this.format);
  }

  static getLatestRoundNumber(eventId) {
    const stmt = db.prepare('SELECT MAX(round_number) as max FROM rounds WHERE event_id = ?');
    const result = stmt.get(eventId);
    return result?.max ?? 0;
  }

  static format(round) {
    return {
      id: round.id,
      eventId: round.event_id,
      roundNumber: round.round_number,
      restingPlayers: JSON.parse(round.resting_players),
      createdAt: round.created_at
    };
  }
}

module.exports = Round;
