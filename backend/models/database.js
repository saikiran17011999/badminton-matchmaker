const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const config = require('../config');

const dbDir = path.dirname(config.databasePath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(config.databasePath);

db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK(type IN ('singles', 'doubles')),
    num_courts INTEGER NOT NULL,
    current_round INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS players (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL,
    name TEXT NOT NULL,
    rating INTEGER DEFAULT 1000,
    matches_played INTEGER DEFAULT 0,
    joined_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS rounds (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL,
    round_number INTEGER NOT NULL,
    resting_players TEXT DEFAULT '[]',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    UNIQUE(event_id, round_number)
  );

  CREATE TABLE IF NOT EXISTS matches (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL,
    round_number INTEGER NOT NULL,
    court_number INTEGER NOT NULL,
    team1_players TEXT NOT NULL,
    team2_players TEXT NOT NULL,
    team1_score INTEGER DEFAULT NULL,
    team2_score INTEGER DEFAULT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed')),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_players_event ON players(event_id);
  CREATE INDEX IF NOT EXISTS idx_rounds_event ON rounds(event_id);
  CREATE INDEX IF NOT EXISTS idx_matches_event ON matches(event_id);
`);

module.exports = db;
