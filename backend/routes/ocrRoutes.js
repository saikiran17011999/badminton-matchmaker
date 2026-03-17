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

const EXTRACTION_PROMPT = `Extract handwritten names from this badminton sign-up sheet.

RULES:
1. Output one name per line
2. Names can be Japanese (漢字, ひらがな, カタカナ) or English
3. REMOVE any numbering (1., 2., ①, etc.) - output ONLY the name itself
4. IGNORE headers like "No.", "氏名", "名前"
5. If a name is UNCLEAR or UNREADABLE, output an empty line (so organizer can fill it manually)
6. Preserve the order as they appear

Examples of Japanese names: 田中, 鈴木, うしお, せな, サイ, 坂本

Output names now:`;

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

    // Clean up extracted names
    const names = extractedText
      .split('\n')
      .map(name => {
        let cleaned = name.trim();
        // Remove numbering patterns
        cleaned = cleaned
          .replace(/^[\d]+[.\):\-\s、]\s*/u, '')     // 1. 2) 3: 4- 5、
          .replace(/^[\(（][\d]+[\)）]\s*/u, '')     // (1) （2）
          .replace(/^[①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳]\s*/u, '')  // Circled numbers
          .replace(/^[一二三四五六七八九十]+[.\s、]\s*/u, '')  // Japanese numbers
          .replace(/^[-•·●○◯]\s*/u, '')              // Bullets
          .trim();
        return cleaned;
      })
      .filter(name => {
        // Filter headers, not empty lines (keep empty for manual edit)
        if (name.includes(':')) return false;
        if (/^(no\.?|name|names|player|players|参加者|名前|選手|氏名|番号|ナンバー)$/i.test(name)) return false;
        if (/^[\d]+$/.test(name)) return false;
        return true;
      });

    // Remove consecutive empty lines, keep single empty lines for unclear names
    const cleanedNames = [];
    for (const name of names) {
      if (name === '' && cleanedNames[cleanedNames.length - 1] === '') {
        continue; // Skip consecutive empty lines
      }
      cleanedNames.push(name);
    }

    console.log(`Extracted ${cleanedNames.filter(n => n).length} names`);
    res.json({ names: cleanedNames });

  } catch (error) {
    console.error('OCR extraction error:', error);
    res.status(500).json({
      error: 'Failed to extract names from image',
      details: error.message
    });
  }
});

module.exports = router;
