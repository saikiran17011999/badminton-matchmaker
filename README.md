# Badminton Event Matchmaking SaaS

A production-quality web application that helps badminton event organizers automatically generate fair matches for players during events.

## Features

- **Event Setup**: Create singles or doubles events with configurable courts
- **Smart Matchmaking**: Algorithm ensures balanced teams and fair playtime
- **Live Dashboard**: Visual court cards showing active matches
- **Player Management**: Add, edit, remove players mid-event
- **Rating System**: Dynamic ratings that improve match balance over time
- **Round Navigation**: Browse through match history

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
