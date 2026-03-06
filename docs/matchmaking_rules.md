# Matchmaking Rules

## Core Principles

1. **Fair Playtime** - All players should play similar number of matches
2. **Balanced Teams** - Team members should have similar skill levels
3. **Competitive Matches** - Opposing teams should be evenly matched
4. **Variety** - Avoid repetitive matchups

## Algorithm Steps

### Step 1: Player Selection

```
For each round:
1. Sort players by matches_played (ascending)
2. Calculate required players: courts × 4 (doubles) or courts × 2 (singles)
3. Select players with lowest match counts
4. Remaining players go to rest pool
```

### Step 2: Late Joiner Handling

```
When player joins mid-event:
1. Find minimum matches_played among all players
2. Set new player's matches_played = minimum
3. This ensures fair priority in selection
```

### Step 3: Team Formation (Doubles)

```
Goal: Minimize rating difference within teams

Algorithm:
1. Sort selected players by rating
2. Pair highest with lowest, second highest with second lowest
3. This creates balanced team compositions
```

Example:
```
Players: A(1200), B(1100), C(1000), D(900)
Teams: [A+D] vs [B+C]
       (1200+900=2100) vs (1100+1000=2100)
```

### Step 4: Match Pairing

```
Goal: Match teams with similar average ratings

Algorithm:
1. Calculate average rating for each team
2. Sort teams by average rating
3. Pair adjacent teams (1v2, 3v4, etc.)
4. Add randomness factor (±5%) to avoid repetition
```

### Step 5: Court Assignment

```
1. Assign matches to available courts
2. Track court usage for balanced distribution
```

## Rating System

### Initial Rating
- All players start at 1000

### Rating Update Formula (ELO-based)

```javascript
K = 32 // K-factor for volatility

expectedScore = 1 / (1 + 10^((opponentRating - playerRating) / 400))

// After match:
newRating = oldRating + K * (actualScore - expectedScore)

// actualScore: 1 for win, 0 for loss, 0.5 for draw
```

### Score Difference Modifier

```javascript
// Bonus/penalty based on score margin
scoreDiff = Math.abs(team1Score - team2Score)
modifier = 1 + (scoreDiff * 0.05) // Up to 50% bonus for dominant wins

finalRatingChange = baseChange * modifier
```

## Resting Players

- Players not selected enter rest pool
- Rest pool players get +1 priority for next round
- Priority resets after playing

## Randomness Factor

To avoid predictable matchups:
- 10% chance to swap adjacent teams in pairing
- Slight random shuffle within same-priority players
