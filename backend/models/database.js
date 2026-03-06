const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');
const config = require('../config');

let db = null;
let SQL = null;

const dbDir = path.dirname(config.databasePath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const saveDatabase = () => {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(config.databasePath, buffer);
  }
};

const initDatabase = async () => {
  if (db) return db;

  SQL = await initSqlJs();

  try {
    if (fs.existsSync(config.databasePath)) {
      const fileBuffer = fs.readFileSync(config.databasePath);
      db = new SQL.Database(fileBuffer);
    } else {
      db = new SQL.Database();
    }
  } catch (err) {
    console.log('Creating new database');
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL CHECK(type IN ('singles', 'doubles')),
      num_courts INTEGER NOT NULL,
      current_round INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS players (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      name TEXT NOT NULL,
      rating INTEGER DEFAULT 1000,
      matches_played INTEGER DEFAULT 0,
      joined_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS rounds (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      round_number INTEGER NOT NULL,
      resting_players TEXT DEFAULT '[]',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
      UNIQUE(event_id, round_number)
    )
  `);

  db.run(`
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
    )
  `);

  saveDatabase();
  return db;
};

const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
};

const prepare = (sql) => {
  const database = getDb();
  return {
    run: (...params) => {
      database.run(sql, params);
      saveDatabase();
      return { changes: database.getRowsModified() };
    },
    get: (...params) => {
      const stmt = database.prepare(sql);
      stmt.bind(params);
      if (stmt.step()) {
        const row = stmt.getAsObject();
        stmt.free();
        return row;
      }
      stmt.free();
      return undefined;
    },
    all: (...params) => {
      const results = [];
      const stmt = database.prepare(sql);
      stmt.bind(params);
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      stmt.free();
      return results;
    }
  };
};

module.exports = {
  initDatabase,
  getDb,
  prepare,
  saveDatabase
};
