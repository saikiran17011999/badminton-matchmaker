const db = require('./database');
const { generateEventId } = require('../utils/idGenerator');

class Event {
  static create({ type, numCourts }) {
    const id = generateEventId();
    const stmt = db.prepare(`
      INSERT INTO events (id, type, num_courts)
      VALUES (?, ?, ?)
    `);
    stmt.run(id, type, numCourts);
    return this.findById(id);
  }

  static findById(id) {
    const stmt = db.prepare('SELECT * FROM events WHERE id = ?');
    const event = stmt.get(id);
    if (!event) return null;
    return this.format(event);
  }

  static updateCurrentRound(id, roundNumber) {
    const stmt = db.prepare('UPDATE events SET current_round = ? WHERE id = ?');
    stmt.run(roundNumber, id);
    return this.findById(id);
  }

  static delete(id) {
    const stmt = db.prepare('DELETE FROM events WHERE id = ?');
    return stmt.run(id);
  }

  static format(event) {
    return {
      id: event.id,
      type: event.type,
      numCourts: event.num_courts,
      currentRound: event.current_round,
      createdAt: event.created_at
    };
  }
}

module.exports = Event;
