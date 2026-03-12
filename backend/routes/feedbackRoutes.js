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

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// POST /api/feedback - Submit feedback
router.post('/', upload.single('audio'), async (req, res) => {
  try {
    const { type, email, message } = req.body;
    const audioFile = req.file;

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
      from: 'badmintonmatchmaker@gmail.com',
      to: 'badmintonmatchmaker@gmail.com',
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
      await transporter.sendMail(mailOptions);
      console.log('Feedback email sent successfully');
    } else {
      // If email not configured, just log it
      console.log('Email not configured. Feedback received:');
      console.log(emailContent);
      if (audioFile) {
        console.log(`Audio file size: ${audioFile.size} bytes`);
      }
    }

    res.json({ success: true, message: 'Feedback received successfully' });
  } catch (error) {
    console.error('Failed to process feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

module.exports = router;
