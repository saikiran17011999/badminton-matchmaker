# Matchmaking Engine

Core algorithm for generating fair badminton matches.

## Structure

```
/matchmaking
├── matchmakingEngine.js   # Main orchestrator
├── ratingSystem.js        # ELO-based rating calculations
├── teamFormation.js       # Balance team composition
├── matchPairing.js        # Pair teams fairly
├── playerSelection.js     # Select players for round
└── README.md
```

## Algorithm Flow

```
1. Player Selection
   └─> Select players with lowest match counts

2. Team Formation (Doubles)
   └─> Pair players to minimize intra-team rating diff

3. Match Pairing
   └─> Match teams with similar average ratings

4. Court Assignment
   └─> Assign matches to available courts

5. Rating Update (after match)
   └─> Apply ELO formula with score modifier
```

## Key Functions

### matchmakingEngine.js
```javascript
generateRound(players, numCourts, eventType)
// Returns: { matches: [...], restingPlayers: [...] }
```

### ratingSystem.js
```javascript
calculateNewRatings(team1, team2, team1Score, team2Score)
// Returns: Updated player ratings
```

### teamFormation.js
```javascript
formTeams(players)
// Returns: Array of [player1, player2] pairs
```

### matchPairing.js
```javascript
pairTeams(teams)
// Returns: Array of { team1, team2 } matchups
```

## Configuration

| Parameter | Default | Description |
|-----------|---------|-------------|
| K_FACTOR | 32 | Rating volatility |
| BASE_RATING | 1000 | Starting player rating |
| RANDOMNESS | 0.1 | Shuffle factor (10%) |
