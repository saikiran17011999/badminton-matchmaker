# System Architecture

## Overview

The Badminton Event Matchmaking system uses a three-tier architecture:

```
┌─────────────────┐      ┌─────────────────┐     ┌─────────────────┐
│    Frontend     │────▶│     Backend     │────▶│    Database     │
│ React + Tailwind│      │  Express.js     │     │     SQLite      │
└─────────────────┘      └─────────────────┘     └─────────────────┘
```

## Component Responsibilities

### Frontend (React)

**Pages:**
| Page | Route | Description |
|------|-------|-------------|
| EventSetup | `/` | Create event, select courts, add players |
| Dashboard | `/event/:eventId` | Match view, score entry, player panel |
| TimerPage | `/timer` | Countdown timer with audio alerts |
| FeedbackPage | `/feedback` | Voice/text feedback submission |
| CombosPage | `/combos` | Training combo sequences with videos |

**Components:**
| Component | Description |
|-----------|-------------|
| NavDrawer | Hamburger menu navigation |
| CourtCard | Horizontal court display with glassmorphism, drag-drop support |
| PlayerPanel | Player list management |
| PlayerCard | Individual player display with drag-and-drop states |
| ScrollPicker | iOS-style scroll picker for scores |
| RestingArea | Bench area with drag-and-drop support |
| RoundNavigation | Round history navigation |

**Hooks:**
| Hook | Description |
|------|-------------|
| useDragSwap | Drag-and-drop player swap with touch support |
| useSwap | Legacy click-based swap (deprecated) |

**Context:**
| Context | Purpose |
|---------|---------|
| EventContext | Event state management, admin token handling |
| LanguageContext | i18n (English/Japanese) |

### Backend (Express.js)
- REST API endpoints
- Request validation
- Business logic orchestration
- Matchmaking engine coordination
- Database operations
- Feedback storage (text + voice audio)
- Role-based access control (organiser/viewer)

### Database (SQLite)
- Event persistence (with admin_token, share_code)
- Player data storage
- Match history
- Rating tracking
- Feedback storage (with audio blobs)

## Role-Based Access Control

```
┌─────────────────────────────────────────────────────────────────┐
│                     ACCESS CONTROL                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ORGANISER (has admin token)     VIEWER (no token)              │
│  ─────────────────────────       ──────────────────             │
│  ✅ Create/delete event          ❌ Create/delete event         │
│  ✅ Add/edit/remove players      ❌ Add/edit/remove players     │
│  ✅ Generate rounds              ❌ Generate rounds             │
│  ✅ Enter scores                 ❌ Enter scores                │
│  ✅ Swap players                 ❌ Swap players                │
│  ✅ View all data                ✅ View all data               │
│  ✅ Share link                   ✅ Share link                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Token Flow

1. **Create Event** → Backend generates `adminToken` + `shareCode`
2. **Organiser** → Token stored in localStorage, passed with requests
3. **Share Link** → `/event/:id` without token = viewer mode
4. **API Protection** → `requireOrganiser` middleware validates token

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

## Player Swap Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    DRAG-AND-DROP SWAP                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Drag Start                                                   │
│     └─ Player card becomes draggable                             │
│     └─ Drag ghost (red badge) follows cursor                     │
│     └─ Source card fades + dashed border                         │
│                                                                  │
│  2. Drag Over                                                    │
│     └─ Valid targets get green glow                              │
│     └─ Can drop on court players OR bench players                │
│                                                                  │
│  3. Drop                                                         │
│     └─ POST /api/events/:id/matches/swap                         │
│     └─ Backend swaps in matches AND/OR resting list              │
│     └─ Both cards flash green (swap animation)                   │
│     └─ Dashboard refreshes with new positions                    │
│                                                                  │
│  Swap Types:                                                     │
│  ├─ Court ↔ Court (same match)                                   │
│  ├─ Court ↔ Court (different matches)                            │
│  └─ Court ↔ Bench (playing ↔ resting)                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| SQLite over PostgreSQL | Simpler deployment, sufficient for event scale |
| REST over WebSocket | Simpler implementation, polling acceptable |
| Monorepo structure | Easier development and deployment |
| ELO-based ratings | Proven fair rating system |
