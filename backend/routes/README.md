# Routes

Express route definitions that map URLs to controllers.

## Responsibilities

- Define API endpoints
- Apply middleware (including auth)
- Route to appropriate controllers

## Files

| File | Purpose |
|------|---------|
| index.js | Main router aggregating all routes |
| eventRoutes.js | /api/events/* routes (includes share code lookup) |
| playerRoutes.js | /api/events/:id/players/* routes (protected) |
| matchRoutes.js | /api/events/:id/matches/* routes (protected) |
| roundRoutes.js | /api/events/:id/rounds/* routes (protected) |
| feedbackRoutes.js | /api/feedback routes (POST to submit, GET to list) |

## Role-Based Access Control

Routes are protected using `requireOrganiser` middleware:

```javascript
const requireOrganiser = require('../middleware/requireOrganiser');

// Public - anyone can read
router.get('/', controller.getPlayers);

// Protected - organiser only
router.post('/', requireOrganiser, controller.addPlayer);
router.put('/:playerId', requireOrganiser, controller.updatePlayer);
router.delete('/:playerId', requireOrganiser, controller.removePlayer);
```

## Protected Routes

| Route | Method | Protected |
|-------|--------|-----------|
| `/events` | POST | No |
| `/events/:id` | GET | No |
| `/events/:id` | DELETE | Yes |
| `/events/join/:shareCode` | GET | No |
| `/events/:id/players` | GET | No |
| `/events/:id/players` | POST | Yes |
| `/events/:id/players/:pid` | PUT/DELETE | Yes |
| `/events/:id/rounds/generate` | POST | Yes |
| `/events/:id/rounds/:num` | GET | No |
| `/events/:id/matches/:mid` | PUT | Yes |
| `/events/:id/matches/swap` | POST | Yes |
