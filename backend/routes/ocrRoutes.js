const express = require('express');
const router = express.Router();
const multer = require('multer');
const config = require('../config');

// Configure multer for memory storage (no disk writes)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

const EXTRACTION_PROMPT = `Extract all handwritten names from this image. This is a sign-up sheet for a badminton event.

Rules:
- Return ONLY the names, one per line
- No numbering, no bullets, no extra text
- If a name is unclear, make your best guess
- Ignore any non-name text (like titles, dates, headers)
- Return names in the order they appear

Example output:
Alice
Bob
Charlie

Now extract the names:`;

// Provider: Anthropic Claude
async function extractWithClaude(base64Image, mediaType) {
  const Anthropic = require('@anthropic-ai/sdk').default;
  const client = new Anthropic({ apiKey: config.anthropicApiKey });

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: base64Image
            }
          },
          { type: 'text', text: EXTRACTION_PROMPT }
        ]
      }
    ]
  });

  return response.content[0]?.text || '';
}

// Provider: OpenAI GPT-4o
async function extractWithOpenAI(base64Image, mediaType) {
  const OpenAI = require('openai').default;
  const client = new OpenAI({ apiKey: config.openaiApiKey });

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: `data:${mediaType};base64,${base64Image}`
            }
          },
          { type: 'text', text: EXTRACTION_PROMPT }
        ]
      }
    ]
  });

  return response.choices[0]?.message?.content || '';
}

// Provider: Google Cloud Vision
async function extractWithGoogleVision(base64Image) {
  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${config.googleCloudApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [
          {
            image: { content: base64Image },
            features: [{ type: 'DOCUMENT_TEXT_DETECTION' }]
          }
        ]
      })
    }
  );

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.responses?.[0]?.fullTextAnnotation?.text || '';
}

// Determine which provider to use
function getProvider() {
  if (config.anthropicApiKey) return { name: 'claude', extract: extractWithClaude };
  if (config.openaiApiKey) return { name: 'openai', extract: extractWithOpenAI };
  if (config.googleCloudApiKey) return { name: 'google', extract: extractWithGoogleVision };
  return null;
}

// POST /api/ocr/extract-names
router.post('/extract-names', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const provider = getProvider();
    if (!provider) {
      return res.status(500).json({
        error: 'No OCR provider configured',
        hint: 'Set ANTHROPIC_API_KEY, OPENAI_API_KEY, or GOOGLE_CLOUD_API_KEY in .env'
      });
    }

    const base64Image = req.file.buffer.toString('base64');
    const mediaType = req.file.mimetype;

    console.log(`Extracting names using ${provider.name}...`);

    const extractedText = await provider.extract(base64Image, mediaType);

    // Clean up: filter empty lines and trim whitespace
    const names = extractedText
      .split('\n')
      .map(name => name.trim())
      .filter(name => name.length > 0 && !name.includes(':'));

    res.json({ names, provider: provider.name });

  } catch (error) {
    console.error('OCR extraction error:', error);
    res.status(500).json({
      error: 'Failed to extract names from image',
      details: error.message
    });
  }
});

module.exports = router;
