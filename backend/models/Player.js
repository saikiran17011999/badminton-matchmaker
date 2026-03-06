const db = require('./database');
const { generatePlayerId } = require('../utils/idGenerator');

class Player {
  static create({ eventId, name, rating = 1000, matchesPlayed = 0 }) {
    const id = generatePlayerId();
    const stmt = db.prepare(`
      INSERT INTO players (id, event_id, name, rating, matches_played)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(id, eventId, name, rating, matchesPlayed);
    return this.findById(id);
  }

  static findById(id) {
    const stmt = db.prepare('SELECT * FROM players WHERE id = ?');
    const player = stmt.get(id);
    if (!player) return null;
    return this.format(player);
  }

  static findByEventId(eventId) {
    const stmt = db.prepare('SELECT * FROM players WHERE event_id = ? ORDER BY joined_at');
    const players = stmt.all(eventId);
    return players.map(this.format);
  }

  static update(id, { name, rating, matchesPlayed }) {
    const current = this.findById(id);
    if (!current) return null;

    const stmt = db.prepare(`
      UPDATE players
      SET name = ?, rating = ?, matches_played = ?
      WHERE id = ?
    `);
    stmt.run(
      name ?? current.name,
      rating ?? current.rating,
      matchesPlayed ?? current.matchesPlayed,
      id
    );
    return this.findById(id);
  }

  static incrementMatchesPlayed(id) {
    const stmt = db.prepare(`
      UPDATE players SET matches_played = matches_played + 1 WHERE id = ?
    `);
    stmt.run(id);
  }

  static updateRating(id, newRating) {
    const stmt = db.prepare('UPDATE players SET rating = ? WHERE id = ?');
    stmt.run(Math.round(newRating), id);
  }

  static getMinMatchesPlayed(eventId) {
    const stmt = db.prepare('SELECT MIN(matches_played) as min FROM players WHERE event_id = ?');
    const result = stmt.get(eventId);
    return result?.min ?? 0;
  }

  static delete(id) {
    const stmt = db.prepare('DELETE FROM players WHERE id = ?');
    return stmt.run(id);
  }

  static format(player) {
    return {
      id: player.id,
      eventId: player.event_id,
      name: player.name,
      rating: player.rating,
      matchesPlayed: player.matches_played,
      joinedAt: player.joined_at
    };
  }
}

module.exports = Player;
