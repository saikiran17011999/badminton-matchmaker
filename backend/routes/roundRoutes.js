const express = require('express');
const router = express.Router({ mergeParams: true });
const roundController = require('../controllers/roundController');
const requireOrganiser = require('../middleware/requireOrganiser');

// Write - organiser only
router.post('/generate', requireOrganiser, roundController.generateRound);

// Read - anyone can view
router.get('/:roundNumber', roundController.getRound);

module.exports = router;
