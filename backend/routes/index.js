const express = require('express');
const router = express.Router();

const eventRoutes = require('./eventRoutes');
const playerRoutes = require('./playerRoutes');
const matchRoutes = require('./matchRoutes');
const roundRoutes = require('./roundRoutes');

router.use('/events', eventRoutes);
router.use('/events/:eventId/players', playerRoutes);
router.use('/events/:eventId/matches', matchRoutes);
router.use('/events/:eventId/rounds', roundRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
