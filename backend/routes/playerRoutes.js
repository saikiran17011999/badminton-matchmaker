const express = require('express');
const router = express.Router({ mergeParams: true });
const playerController = require('../controllers/playerController');

router.get('/', playerController.getPlayers);
router.post('/', playerController.addPlayer);
router.put('/:playerId', playerController.updatePlayer);
router.delete('/:playerId', playerController.removePlayer);

module.exports = router;
