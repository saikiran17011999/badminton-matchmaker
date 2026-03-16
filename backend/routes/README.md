# Routes

Express route definitions that map URLs to controllers.

## Responsibilities

- Define API endpoints
- Apply middleware
- Route to appropriate controllers

## Files

| File | Purpose |
|------|---------|
| index.js | Main router aggregating all routes |
| eventRoutes.js | /api/events/* routes |
| playerRoutes.js | /api/events/:id/players/* routes |
| matchRoutes.js | /api/events/:id/matches/* routes |
| roundRoutes.js | /api/events/:id/rounds/* routes |
| feedbackRoutes.js | /api/feedback routes (POST to submit, GET to list) |

## Pattern

```javascript
const express = require('express');
const router = express.Router();
const controller = require('../controllers/eventController');

router.post('/', controller.createEvent);
router.get('/:id', controller.getEvent);

module.exports = router;
```
