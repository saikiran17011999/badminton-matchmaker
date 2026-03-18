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
   └─> Select players with lowest match counts (matchesPlayed)

2. Late Joiner Handling
   └─> New player gets max(0, min - 1) for fair priority

3. Team Formation (Doubles)
   └─> Pair players to minimize intra-team rating diff

4. Match Pairing
   └─> Match teams with similar average ratings

5. Court Assignment
   └─> Assign matches to available courts

6. Swap Handling (Court ↔ Bench)
   └─> Adjust matchesPlayed: +1 for court, -1 for bench

7. Rating Update (after match)
   └─> Apply ELO formula with score modifier
```

## Match Count Types

| Field | Purpose |
|-------|---------|
| matchesPlayed | Adjusted count for matchmaking algorithm |
| actualMatchesPlayed | Real count from matches table (UI display) |

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
