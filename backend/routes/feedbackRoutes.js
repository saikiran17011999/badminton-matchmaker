const express = require('express');
const router = express.Router();
const multer = require('multer');
const { prepare } = require('../models/database');

// Configure multer for audio file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// POST /api/feedback - Submit feedback (saves to database)
router.post('/', upload.single('audio'), async (req, res) => {
  try {
    const { type, email, message } = req.body;
    const audioFile = req.file;

    console.log('=== NEW FEEDBACK RECEIVED ===');
    console.log('Type:', type);
    console.log('Email:', email || 'Not provided');
    console.log('Message:', message || '(voice recording)');
    console.log('Has Audio:', !!audioFile);
    console.log('Timestamp:', new Date().toISOString());
    console.log('=============================');

    // Save to database
    const stmt = prepare(`
      INSERT INTO feedback (type, email, message, has_audio, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(
      type,
      email || 'Not provided',
      message || null,
      audioFile ? 1 : 0,
      new Date().toISOString()
    );

    console.log('Feedback saved to database successfully');

    res.json({ success: true, message: 'Feedback received successfully' });
  } catch (error) {
    console.error('Failed to process feedback:', error.message);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// GET /api/feedback - Get all feedback (for admin)
router.get('/', async (req, res) => {
  try {
    const stmt = prepare('SELECT * FROM feedback ORDER BY created_at DESC');
    const feedback = stmt.all();
    res.json(feedback);
  } catch (error) {
    console.error('Failed to fetch feedback:', error.message);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

module.exports = router;
