const express = require('express');
const router = express.Router({ mergeParams: true });
const matchController = require('../controllers/matchController');
const requireOrganiser = require('../middleware/requireOrganiser');

// Write - organiser only
router.put('/:matchId', requireOrganiser, matchController.updateMatchScore);
router.post('/swap', requireOrganiser, matchController.swapPlayers);

module.exports = router;
