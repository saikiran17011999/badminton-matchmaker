const express = require('express');
const router = express.Router({ mergeParams: true });
const roundController = require('../controllers/roundController');

router.post('/generate', roundController.generateRound);
router.get('/:roundNumber', roundController.getRound);

module.exports = router;
