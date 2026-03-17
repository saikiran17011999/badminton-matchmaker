# Frontend

React application for the Badminton Matchmaking system built with Vite.

## Structure

```
/frontend/src
├── /assets         # Static assets (images, icons)
├── /components     # Reusable UI components
│   ├── CourtCard.jsx       # Court display with match info
│   ├── NavDrawer.jsx       # Navigation hamburger menu
│   ├── PlayerCard.jsx      # Player display card
│   ├── PlayerPanel.jsx     # Side panel with players
│   ├── RestingArea.jsx     # Players waiting area
│   ├── RoundNavigation.jsx # Round history nav
│   ├── ScrollPicker.jsx    # iOS-style score picker
│   └── SwapIndicator.jsx   # Swap mode visual
├── /context        # React context providers
│   ├── EventContext.jsx    # Event state, admin token, role management
│   └── LanguageContext.jsx # i18n support (EN/JP)
├── /hooks          # Custom React hooks
│   ├── useSwap.js          # Player swap logic (click-based, legacy)
│   └── useDragSwap.js      # Drag-and-drop swap with touch support
├── /pages          # Route pages
│   ├── EventSetup.jsx      # Home - create event
│   ├── Dashboard.jsx       # Match dashboard
│   ├── TimerPage.jsx       # Match timer
│   ├── FeedbackPage.jsx    # Submit feedback
│   └── CombosPage.jsx      # Training combos
├── /services       # API service functions
├── /translations   # Language files
│   ├── en.json             # English
│   └── ja.json             # Japanese
├── App.jsx         # Root component with routes
├── App.css         # Global styles
├── index.css       # Tailwind + custom CSS
└── main.jsx        # Entry point
```

## Setup

```bash
npm install
npm run dev     # Development server (Vite)
npm run build   # Production build
npm run preview # Preview production build
```

## Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | EventSetup | Create event, configure courts, add players |
| `/event/:eventId` | Dashboard | View matches, enter scores, manage players |
| `/timer` | TimerPage | Match countdown timer with alerts |
| `/feedback` | FeedbackPage | Submit voice or text feedback |
| `/combos` | CombosPage | Training combo sequences |

## UI Features

### Glassmorphism Design
- Frosted glass effect on cards
- Blur backdrop on modals
- Horizontal court layout

### Score Modal
- ScrollPicker component for score entry
- Blur backdrop overlay
- Touch-friendly on mobile

### Language Support
- Toggle between English and Japanese
- Translations in `/translations` folder
- LanguageContext for state management
- Full Japanese support: 主催者, 観覧者, 休憩, etc.

### Role-Based Access
- **Organiser**: Full control (create, edit, generate, score)
- **Viewer**: Read-only (view matches, scores, players)
- Role badge displays current access level
- Share button copies read-only link

### Navigation Drawer
- Hamburger menu icon
- Links to all pages
- Slide-in animation

### Drag-and-Drop Player Swap
Organisers can swap players by dragging:
- **Drag** any player card (grab cursor indicates draggable)
- **Visual feedback**: Dragged card fades, red badge follows cursor
- **Drop target**: Green glow on valid drop targets
- **Swap animation**: Green flash on successful swap
- **Supported swaps**:
  - Court ↔ Court (same or different matches)
  - Court ↔ Bench (swap playing and resting players)
- **Mobile support**: Touch drag gestures supported
- **Error handling**: Shows error message if swap fails

## Key Components

### CourtCard
Displays a court with:
- Team players on each side
- Score display
- Tap to enter/edit score
- Drag-and-drop swap support via `dragHandlers` prop

### PlayerCard
Individual player display with:
- Avatar with deterministic color
- Player name and rating
- Selection/dragging/drop-target states
- Drag handle indicator on hover
- Supports: `draggable`, `isDragging`, `isDropTarget`, `isSwapping`

### PlayerPanel
Side panel showing:
- All players in event
- Player stats (matches, rating)
- Add/edit/remove players

### RestingArea
Bench area showing:
- Players not in current matches
- Drag-and-drop swap support
- Priority indicator

### ScrollPicker
iOS-style picker for:
- Score entry (0-30)
- Smooth scroll with snap
- Visual selection indicator

## Styling

- **TailwindCSS** for utility classes
- **Custom CSS** in index.css for:
  - Glassmorphism effects
  - Animations
  - Scroll picker styles

## API Integration

Frontend communicates with backend via:
- Base URL: `/api` (proxied to backend in dev)
- REST endpoints for all operations
- Multipart form data for audio upload
- Admin token passed as `?token=` query param

## Token Management

Admin tokens are managed in `EventContext`:
- `saveAdminToken(eventId, token)` - Store after creating event
- `getAdminToken()` - Retrieve for API calls
- `isOrganiser()` - Check current role
- Tokens stored in `localStorage` with key `admin_token_{eventId}`

## Environment Variables

Create `.env` file (optional):
```
VITE_API_URL=http://localhost:3001
```
