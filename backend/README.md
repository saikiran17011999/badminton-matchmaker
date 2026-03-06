# Backend

Express.js API server for the Badminton Matchmaking application.

## Structure

```
/backend
├── /controllers    # Request handlers
├── /routes         # API route definitions
├── /services       # Business logic
├── /models         # Data models & DB operations
├── /utils          # Helper functions
├── /middleware     # Express middleware
├── /config         # Configuration files
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

## API Base URL

`http://localhost:3001/api`
