# Utils

Utility functions and helpers used across the backend.

## Responsibilities

- Common helper functions
- Data transformation utilities
- Validation helpers
- ID and token generation

## Files

| File | Purpose |
|------|---------|
| idGenerator.js | Generate unique IDs, admin tokens, share codes |
| validators.js | Input validation functions |
| responseHelpers.js | Standardized API response formatting |

## ID Generator Functions

| Function | Output | Example |
|----------|--------|---------|
| `generateEventId()` | Event ID | `evt_a1b2c3d4` |
| `generatePlayerId()` | Player ID | `player_e5f6g7h8` |
| `generateMatchId()` | Match ID | `match_i9j0k1l2` |
| `generateRoundId()` | Round ID | `round_m3n4o5p6` |
| `generateAdminToken()` | 16-char secure token | `a1b2c3d4e5f6g7h8` |
| `generateShareCode()` | Human-friendly code | `GAME-A1B2` |
