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
| matchService.js | Match state management |
| roundService.js | Round generation orchestration |

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
