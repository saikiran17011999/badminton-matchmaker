# API Documentation

Base URL: `http://localhost:3001/api`

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
  "players": [...],
  "createdAt": "2024-01-15T10:00:00Z"
}
```

### Get Event
```
GET /events/:eventId
```

**Response:** Full event object with players and current round

---

## Players

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
POST /events/:eventId/swap
```

**Request Body:**
```json
{
  "player1Id": "p1",
  "player2Id": "p3"
}
```

Swaps positions of two players in current round matches.

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
