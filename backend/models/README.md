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
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Primary key (evt_xxxxx) |
| type | TEXT | 'singles' or 'doubles' |
| num_courts | INTEGER | Number of courts |
| current_round | INTEGER | Current round number |
| admin_token | TEXT | Secret token for organiser access |
| share_code | TEXT | Human-friendly share code (GAME-XXXX) |
| created_at | TEXT | Timestamp |

### Player
- id, eventId, name, rating, matchesPlayed, joinedAt
- **matchesPlayed**: Adjusted count for matchmaking (includes late-joiner normalization)
- **actualMatchesPlayed**: Calculated from matches table (for UI display)

### Match
- id, eventId, roundNumber, courtNumber, team1Players, team2Players, scores, status

### Round
- id, eventId, roundNumber, restingPlayers, createdAt

### Feedback
- id, type, email, message, has_audio, audio_data (base64), created_at

## Event Model Methods

| Method | Description |
|--------|-------------|
| `create({ type, numCourts })` | Create event with auto-generated tokens |
| `findById(id, includeAdminToken)` | Get event, optionally with admin token |
| `findByShareCode(shareCode)` | Find event by share code |
| `verifyAdminToken(eventId, token)` | Validate admin token |
| `updateCurrentRound(id, roundNumber)` | Update round number |
| `delete(id)` | Delete event |

## Round Model Methods

| Method | Description |
|--------|-------------|
| `create({ eventId, roundNumber, restingPlayers })` | Create round with resting players |
| `findByEventAndNumber(eventId, roundNumber)` | Get specific round |
| `findByEventId(eventId)` | Get all rounds for event |
| `getLatestRoundNumber(eventId)` | Get highest round number |
| `updateRestingPlayers(eventId, roundNumber, restingPlayers)` | Update bench players (for swaps) |

## Match Model Methods

| Method | Description |
|--------|-------------|
| `create({ eventId, roundNumber, courtNumber, team1Players, team2Players })` | Create match |
| `findById(id)` | Get match by ID |
| `findByEventAndRound(eventId, roundNumber)` | Get all matches for round |
| `updateScore(id, { team1Score, team2Score })` | Update score and mark completed |
| `updatePlayers(id, { team1Players, team2Players })` | Update player positions (for swaps) |
