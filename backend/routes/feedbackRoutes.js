const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const multer = require('multer');

// Configure multer for audio file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Create transporter lazily to ensure env vars are loaded
const getTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// POST /api/feedback - Submit feedback
router.post('/', upload.single('audio'), async (req, res) => {
  try {
    const { type, email, message } = req.body;
    const audioFile = req.file;

    console.log('Feedback received:', { type, email, hasAudio: !!audioFile });
    console.log('Email config:', {
      user: process.env.EMAIL_USER ? 'SET' : 'NOT SET',
      pass: process.env.EMAIL_PASS ? 'SET' : 'NOT SET'
    });

    // Build email content
    let emailContent = `
New Feedback Received
=====================

Type: ${type === 'voice' ? 'Voice Recording' : 'Text Message'}
Sender Email: ${email || 'Not provided'}
Timestamp: ${new Date().toLocaleString()}

`;

    if (type === 'text') {
      emailContent += `Message:
${message}`;
    } else {
      emailContent += `Voice recording attached.`;
    }

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `[Badminton Matchmaker] New ${type === 'voice' ? 'Voice' : 'Text'} Feedback`,
      text: emailContent,
      attachments: audioFile ? [{
        filename: 'feedback-recording.webm',
        content: audioFile.buffer,
        contentType: audioFile.mimetype
      }] : []
    };

    // Try to send email
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = getTransporter();
      await transporter.sendMail(mailOptions);
      console.log('Feedback email sent successfully to:', process.env.EMAIL_USER);
      res.json({ success: true, message: 'Feedback sent successfully' });
    } else {
      // If email not configured, log and return success anyway
      console.log('Email not configured. Feedback received but not emailed:');
      console.log(emailContent);
      res.json({ success: true, message: 'Feedback received (email not configured)' });
    }
  } catch (error) {
    console.error('Failed to process feedback:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ error: 'Failed to submit feedback: ' + error.message });
  }
});

module.exports = router;
