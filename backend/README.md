# Backend

Express.js API server for the Badminton Matchmaking application.

## Structure

```
/backend
├── /config         # Configuration files
├── /controllers    # Request handlers
├── /data           # SQLite database files
├── /middleware     # Express middleware
├── /models         # Data models & DB operations
│   └── database.js # SQLite connection & queries
├── /routes         # API route definitions
│   ├── index.js        # Route aggregator
│   ├── eventRoutes.js  # Event CRUD
│   ├── playerRoutes.js # Player management
│   ├── matchRoutes.js  # Match operations
│   ├── roundRoutes.js  # Round generation
│   └── feedbackRoutes.js # Feedback API (voice/text)
├── /services       # Business logic
├── /utils          # Helper functions
├── server.js       # Entry point
└── package.json
```

## Setup

```bash
npm install
npm run dev     # Development with hot reload
npm start       # Production
```

## Environment Variables

Create `.env` file:
```
PORT=3001
NODE_ENV=development
DATABASE_PATH=./data/database.sqlite
```

## API Routes

| Route | Description | Auth |
|-------|-------------|------|
| `POST /api/events` | Create event | - |
| `GET /api/events/:id` | Get event | - |
| `GET /api/events/join/:shareCode` | Get event by share code | - |
| `DELETE /api/events/:id` | Delete event | Organiser |
| `POST /api/events/:id/players` | Add player | Organiser |
| `PUT /api/events/:id/players/:pid` | Update player | Organiser |
| `DELETE /api/events/:id/players/:pid` | Remove player | Organiser |
| `POST /api/events/:id/rounds/generate` | Generate round | Organiser |
| `GET /api/events/:id/rounds/:num` | Get round | - |
| `PUT /api/events/:id/matches/:mid` | Update score | Organiser |
| `POST /api/events/:id/matches/swap` | Swap players | Organiser |
| `POST /api/feedback` | Submit feedback | - |
| `GET /api/feedback` | Get all feedback | - |
| `GET /api/health` | Server health check | - |

## Role-Based Access Control

Protected routes require admin token via:
- Query param: `?token=YOUR_ADMIN_TOKEN`
- Header: `x-admin-token: YOUR_ADMIN_TOKEN`

Middleware: `requireOrganiser.js`

## Dependencies

| Package | Purpose |
|---------|---------|
| express | Web framework |
| sql.js | SQLite database (WASM) |
| cors | Cross-origin requests |
| multer | File upload (audio) |
| dotenv | Environment variables |
| uuid | Token/ID generation |

## API Base URL

`http://localhost:3001/api`

See [docs/api.md](../docs/api.md) for full API documentation.
