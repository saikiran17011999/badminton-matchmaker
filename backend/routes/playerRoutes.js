const express = require('express');
const router = express.Router({ mergeParams: true });
const playerController = require('../controllers/playerController');
const requireOrganiser = require('../middleware/requireOrganiser');

// Read - anyone can view
router.get('/', playerController.getPlayers);

// Write - organiser only
router.post('/', requireOrganiser, playerController.addPlayer);
router.put('/:playerId', requireOrganiser, playerController.updatePlayer);
router.delete('/:playerId', requireOrganiser, playerController.removePlayer);

module.exports = router;
