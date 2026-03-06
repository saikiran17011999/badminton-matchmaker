const express = require('express');
const router = express.Router({ mergeParams: true });
const matchController = require('../controllers/matchController');

router.put('/:matchId', matchController.updateMatchScore);
router.post('/swap', matchController.swapPlayers);

module.exports = router;
