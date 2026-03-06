# Models

Data models and database operations.

## Responsibilities

- Define data structures
- Database CRUD operations
- Data validation
- Relationships between entities

## Files

| File | Purpose |
|------|---------|
| Event.js | Event model and operations |
| Player.js | Player model and operations |
| Match.js | Match model and operations |
| Round.js | Round model and operations |
| database.js | SQLite connection and initialization |

## Schema

### Event
- id, type, numCourts, currentRound, createdAt

### Player
- id, eventId, name, rating, matchesPlayed, joinedAt

### Match
- id, eventId, roundNumber, courtNumber, team1Players, team2Players, scores, status

### Round
- id, eventId, roundNumber, restingPlayers, createdAt
