const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.post('/', eventController.createEvent);
router.get('/:eventId', eventController.getEvent);
router.delete('/:eventId', eventController.deleteEvent);

module.exports = router;
