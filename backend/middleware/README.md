# Middleware

Express middleware functions for request processing.

## Responsibilities

- Request logging
- Error handling
- CORS configuration
- Request validation
- Role-based access control

## Files

| File | Purpose |
|------|---------|
| errorHandler.js | Global error handling middleware |
| requestLogger.js | Log incoming requests |
| validateRequest.js | Request body validation |
| requireOrganiser.js | Protect routes that require organiser role |

## Role-Based Access

The `requireOrganiser` middleware protects write operations:

```javascript
const requireOrganiser = require('./middleware/requireOrganiser');

// Protected route - requires admin token
router.post('/generate', requireOrganiser, controller.generate);
```

Token is passed via:
- Query param: `?token=abc123`
- Header: `x-admin-token: abc123`
