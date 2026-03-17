# Services

Business logic layer containing core application functionality.

## Responsibilities

- Implement business rules
- Coordinate between models and matchmaking engine
- Handle complex operations
- Maintain data consistency

## Files

| File | Purpose |
|------|---------|
| eventService.js | Event lifecycle management |
| playerService.js | Player operations and validation |
| matchService.js | Match state management, player swapping |
| roundService.js | Round generation orchestration |

## matchService.js

### `updateMatchScore(matchId, { team1Score, team2Score })`
Updates match score and recalculates player ratings.

### `swapPlayers(eventId, roundNumber, player1Id, player2Id)`
Swaps two players in the current round. Supports:
- **Court ↔ Court (same match)**: Swap teammates or opponents
- **Court ↔ Court (different matches)**: Swap players across courts
- **Court ↔ Bench**: Swap a playing player with a resting player

Uses `Round.updateRestingPlayers()` for bench swaps.

## Pattern

```javascript
const Event = require('../models/Event');
const matchmakingEngine = require('../../matchmaking/matchmakingEngine');

exports.generateRound = async (eventId) => {
  const event = await Event.findById(eventId);
  const players = await event.getPlayers();
  const matches = matchmakingEngine.generateMatches(players, event.numCourts);
  // Save and return
};
```
