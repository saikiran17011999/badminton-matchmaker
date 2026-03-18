# API Documentation

Base URL: `http://localhost:3001/api`

## Authentication

This API uses token-based role authentication:

- **Organiser**: Has admin token, can perform all operations
- **Viewer**: No token, read-only access

### Passing Admin Token

Write operations require the admin token via:
- Query parameter: `?token=YOUR_ADMIN_TOKEN`
- Header: `x-admin-token: YOUR_ADMIN_TOKEN`

---

## Events

### Create Event
```
POST /events
```

**Request Body:**
```json
{
  "type": "doubles",
  "numCourts": 2,
  "playerNames": ["Alice", "Bob", "Charlie", "David"]
}
```

**Response:**
```json
{
  "id": "evt_123",
  "type": "doubles",
  "numCourts": 2,
  "currentRound": 0,
  "adminToken": "abc123xyz789",
  "shareCode": "GAME-A1B2",
  "players": [...],
  "createdAt": "2024-01-15T10:00:00Z"
}
```

> **Important**: Save the `adminToken` - it's required for all write operations.

### Get Event
```
GET /events/:eventId
GET /events/:eventId?token=ADMIN_TOKEN
```

**Response:**
```json
{
  "id": "evt_123",
  "type": "doubles",
  "numCourts": 2,
  "currentRound": 1,
  "shareCode": "GAME-A1B2",
  "role": "organiser",  // or "viewer"
  "players": [...],
  "currentRoundData": {...}
}
```

### Get Event by Share Code
```
GET /events/join/:shareCode
```

**Response:**
```json
{
  "eventId": "evt_123",
  "type": "doubles",
  "numCourts": 2
}
```

### Delete Event (Organiser only)
```
DELETE /events/:eventId?token=ADMIN_TOKEN
```

---

## Players

### Player Object
```json
{
  "id": "p1",
  "name": "Alice",
  "rating": 1000,
  "matchesPlayed": 5,
  "actualMatchesPlayed": 3,
  "joinedAt": "2024-01-15T10:00:00Z"
}
```

| Field | Description |
|-------|-------------|
| matchesPlayed | Adjusted count for matchmaking algorithm |
| actualMatchesPlayed | Real count from matches table (for UI display) |

### Add Player
```
POST /events/:eventId/players
```

**Request Body:**
```json
{
  "name": "NewPlayer"
}
```

### Update Player
```
PUT /events/:eventId/players/:playerId
```

**Request Body:**
```json
{
  "name": "UpdatedName"
}
```

### Remove Player
```
DELETE /events/:eventId/players/:playerId
```

---

## Rounds

### Generate Next Round
```
POST /events/:eventId/rounds/generate
```

**Response:**
```json
{
  "roundNumber": 1,
  "matches": [
    {
      "id": "match_1",
      "court": 1,
      "team1": [{"id": "p1", "name": "Alice"}, {"id": "p2", "name": "Bob"}],
      "team2": [{"id": "p3", "name": "Charlie"}, {"id": "p4", "name": "David"}],
      "status": "pending"
    }
  ],
  "restingPlayers": [...]
}
```

### Get Round
```
GET /events/:eventId/rounds/:roundNumber
```

---

## Matches

### Update Match Score
```
PUT /events/:eventId/matches/:matchId
```

**Request Body:**
```json
{
  "team1Score": 21,
  "team2Score": 15,
  "status": "completed"
}
```

---

## Player Swap

### Swap Players
```
POST /events/:eventId/matches/swap
```

**Request Body:**
```json
{
  "player1Id": "p1",
  "player2Id": "p3",
  "roundNumber": 1
}
```

**Swap Types Supported:**

| Scenario | Description |
|----------|-------------|
| Court ↔ Court (same match) | Swap players within same match (teammates or opponents) |
| Court ↔ Court (different match) | Swap players between different courts |
| Court ↔ Bench | Swap a playing player with a resting player |

**Note:** Court ↔ Bench swaps automatically adjust `matchesPlayed`:
- Player going to bench: matchesPlayed decremented (-1)
- Player going to court: matchesPlayed incremented (+1)

This ensures fair matchmaking priority after manual swaps.

**Response:**
```json
{
  "success": true
}
```

**Error Responses:**
```json
{
  "error": "Player 1 not found in current round",
  "code": "INVALID_SWAP"
}
```

| Error | Description |
|-------|-------------|
| Player not found in current round | Player ID not in any match or bench |
| Cannot swap two bench players | Both players are resting (pointless swap) |
| Cannot swap player with themselves | Same player ID provided twice |

---

---

## Feedback

### Submit Feedback
```
POST /feedback
Content-Type: multipart/form-data
```

**Form Data:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | string | Yes | "bug", "feature", or "other" |
| email | string | No | User's email for follow-up |
| message | string | No | Text feedback (required if no audio) |
| audio | file | No | Voice recording (webm format, max 10MB) |

**Response:**
```json
{
  "success": true,
  "message": "Feedback received successfully"
}
```

### Get All Feedback (Admin)
```
GET /feedback
```

**Response:**
```json
[
  {
    "id": 1,
    "type": "bug",
    "email": "user@example.com",
    "message": "Found an issue...",
    "has_audio": 0,
    "created_at": "2024-03-15T10:00:00Z"
  }
]
```

### Get Feedback Audio
```
GET /feedback/:id/audio
```

**Response:** Audio stream (audio/webm)

---

## Health Check

### Server Health
```
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-03-15T10:00:00Z"
}
```

---

## Error Responses

All errors return:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

| Code | Description |
|------|-------------|
| EVENT_NOT_FOUND | Event ID doesn't exist |
| PLAYER_NOT_FOUND | Player ID doesn't exist |
| INVALID_SWAP | Cannot swap these players |
| NOT_ENOUGH_PLAYERS | Need more players to generate round |
