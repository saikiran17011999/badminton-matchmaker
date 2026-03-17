# Badminton Event Matchmaking SaaS

A production-quality web application that helps badminton event organizers automatically generate fair matches for players during events.

## Features

### Core Matchmaking
- **Event Setup**: Create singles or doubles events with configurable courts
- **Smart Matchmaking**: Algorithm ensures balanced teams and fair playtime
- **Live Dashboard**: Visual court cards showing active matches
- **Player Management**: Add, edit, remove players mid-event
- **Rating System**: Dynamic ELO ratings that improve match balance over time
- **Round Navigation**: Browse through match history

### Role-Based Access Control
- **Organiser Role**: Full control - create events, manage players, generate rounds, enter scores
- **Viewer Role**: Read-only access - view matches and scores via shared link
- **Shareable Links**: Organiser can share event link for spectators
- **Token-Based Auth**: Secure admin token stored locally for organiser access

### UI Features
- **Glassmorphism Design**: Modern frosted glass UI with horizontal court layout
- **Navigation Drawer**: Hamburger menu for easy navigation
- **Score Modal**: Scroll picker with blur backdrop for entering scores
- **Language Toggle**: English/Japanese translations support (全ページ対応)
- **Match Timer**: Countdown timer for matches with audio alerts
- **Training Combos**: Practice combo sequences with video tutorials
- **Feedback System**: Voice and text feedback with database storage

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express.js |
| Frontend | React, TailwindCSS |
| Database | SQLite |
| Deployment | Railway.com |

## Project Structure

```
/backend          # Express.js API server
/frontend         # React application
/matchmaking      # Core matchmaking algorithm
/docs             # Architecture documentation
```

## Quick Start

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Documentation

See [docs/api.md](docs/api.md) for full API reference.

## Matchmaking Rules

See [docs/matchmaking_rules.md](docs/matchmaking_rules.md) for algorithm details.

## License

MIT
