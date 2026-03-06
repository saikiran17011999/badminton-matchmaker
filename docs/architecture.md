# System Architecture

## Overview

The Badminton Event Matchmaking system uses a three-tier architecture:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Frontend     │────▶│     Backend     │────▶│    Database     │
│  React + Tailwind│     │  Express.js     │     │     SQLite      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Component Responsibilities

### Frontend (React)
- Event setup wizard
- Match dashboard with court visualization
- Player management panel
- Round navigation
- Real-time UI updates

### Backend (Express.js)
- REST API endpoints
- Request validation
- Business logic orchestration
- Matchmaking engine coordination
- Database operations

### Database (SQLite)
- Event persistence
- Player data storage
- Match history
- Rating tracking

## Data Flow

1. User creates event via frontend
2. Frontend sends POST to `/api/events`
3. Backend creates event in database
4. User adds players
5. User triggers round generation
6. Matchmaking engine:
   - Selects players (prioritizing fewer matches)
   - Forms balanced teams
   - Pairs teams fairly
7. Matches displayed on dashboard
8. Organizer records scores
9. Ratings update
10. Next round uses updated ratings

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| SQLite over PostgreSQL | Simpler deployment, sufficient for event scale |
| REST over WebSocket | Simpler implementation, polling acceptable |
| Monorepo structure | Easier development and deployment |
| ELO-based ratings | Proven fair rating system |
