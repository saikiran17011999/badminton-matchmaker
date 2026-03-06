const { prepare } = require('./database');
const { generateMatchId } = require('../utils/idGenerator');

class Match {
  static create({ eventId, roundNumber, courtNumber, team1Players, team2Players }) {
    const id = generateMatchId();
    const stmt = prepare(`
      INSERT INTO matches (id, event_id, round_number, court_number, team1_players, team2_players)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      eventId,
      roundNumber,
      courtNumber,
      JSON.stringify(team1Players),
      JSON.stringify(team2Players)
    );
    return this.findById(id);
  }

  static findById(id) {
    const stmt = prepare('SELECT * FROM matches WHERE id = ?');
    const match = stmt.get(id);
    if (!match) return null;
    return this.format(match);
  }

  static findByEventAndRound(eventId, roundNumber) {
    const stmt = prepare(`
      SELECT * FROM matches
      WHERE event_id = ? AND round_number = ?
      ORDER BY court_number
    `);
    const matches = stmt.all(eventId, roundNumber);
    return matches.map(this.format);
  }

  static updateScore(id, { team1Score, team2Score }) {
    const stmt = prepare(`
      UPDATE matches
      SET team1_score = ?, team2_score = ?, status = 'completed'
      WHERE id = ?
    `);
    stmt.run(team1Score, team2Score, id);
    return this.findById(id);
  }

  static updatePlayers(id, { team1Players, team2Players }) {
    const stmt = prepare(`
      UPDATE matches SET team1_players = ?, team2_players = ? WHERE id = ?
    `);
    stmt.run(JSON.stringify(team1Players), JSON.stringify(team2Players), id);
    return this.findById(id);
  }

  static format(match) {
    return {
      id: match.id,
      eventId: match.event_id,
      roundNumber: match.round_number,
      courtNumber: match.court_number,
      team1Players: JSON.parse(match.team1_players),
      team2Players: JSON.parse(match.team2_players),
      team1Score: match.team1_score,
      team2Score: match.team2_score,
      status: match.status
    };
  }
}

module.exports = Match;
