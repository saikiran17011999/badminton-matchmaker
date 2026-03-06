# Controllers

HTTP request handlers that process incoming requests and return responses.

## Responsibilities

- Parse and validate request data
- Call appropriate service methods
- Format and return responses
- Handle HTTP status codes

## Files

| File | Purpose |
|------|---------|
| eventController.js | Event CRUD operations |
| playerController.js | Player management |
| matchController.js | Match operations |
| roundController.js | Round generation and retrieval |

## Pattern

```javascript
// Example controller method
exports.createEvent = async (req, res) => {
  try {
    const eventData = req.body;
    const event = await eventService.createEvent(eventData);
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
```
