const { prepare } = require('./database');
const { generateEventId, generateAdminToken, generateShareCode } = require('../utils/idGenerator');

class Event {
  static create({ type, numCourts }) {
    const id = generateEventId();
    const adminToken = generateAdminToken();
    const shareCode = generateShareCode();

    const stmt = prepare(`
      INSERT INTO events (id, type, num_courts, admin_token, share_code)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(id, type, numCourts, adminToken, shareCode);
    return this.findById(id, true); // Return with admin token
  }

  // Verify if token matches event's admin token
  static verifyAdminToken(eventId, token) {
    const stmt = prepare('SELECT admin_token FROM events WHERE id = ?');
    const event = stmt.get(eventId);
    return event && event.admin_token === token;
  }

  // Find event by share code (for joining via link)
  static findByShareCode(shareCode) {
    const stmt = prepare('SELECT * FROM events WHERE share_code = ?');
    const event = stmt.get(shareCode);
    if (!event) return null;
    return this.format(event, false); // Never include admin token
  }

  static findById(id, includeAdminToken = false) {
    const stmt = prepare('SELECT * FROM events WHERE id = ?');
    const event = stmt.get(id);
    if (!event) return null;
    return this.format(event, includeAdminToken);
  }

  static updateCurrentRound(id, roundNumber) {
    const stmt = prepare('UPDATE events SET current_round = ? WHERE id = ?');
    stmt.run(roundNumber, id);
    return this.findById(id);
  }

  static getJoinBaseline(id) {
    const stmt = prepare('SELECT join_baseline FROM events WHERE id = ?');
    const result = stmt.get(id);
    return result?.join_baseline ?? 0;
  }

  static updateJoinBaseline(id, baseline) {
    const stmt = prepare('UPDATE events SET join_baseline = ? WHERE id = ?');
    stmt.run(baseline, id);
  }

  static delete(id) {
    const stmt = prepare('DELETE FROM events WHERE id = ?');
    return stmt.run(id);
  }

  static format(event, includeAdminToken = false) {
    const formatted = {
      id: event.id,
      type: event.type,
      numCourts: event.num_courts,
      currentRound: event.current_round,
      shareCode: event.share_code,
      joinBaseline: event.join_baseline ?? 0,
      createdAt: event.created_at
    };

    // Only include admin token when explicitly requested (for organiser)
    if (includeAdminToken) {
      formatted.adminToken = event.admin_token;
    }

    return formatted;
  }
}

module.exports = Event;
