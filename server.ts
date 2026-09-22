import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Lazy initialization of Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    timestamp: new Date().toISOString(),
  });
});

// 2. Analyze product image with Gemini Vision
app.post('/api/analyze-image', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback heuristics if API key not available
      return res.json({
        category: 'Kids Cotton Frock',
        clothingType: 'Kids Frock & Dress',
        color: 'Yellow',
        fabricMaterial: 'Pure Cotton',
        patternDesign: 'Floral Print',
        targetAgeGender: '6 Month To 6 Years',
        size: '6 Month To 6 Years',
        keyFeatures: 'Skin friendly soft breathable cotton comfortable flare round neck',
        occasion: 'Festival Daily Wear Casual Birthday Party',
        source: 'fallback',
      });
    }

    // Clean base64 string
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const prompt = `You are a specialist E-Commerce apparel cataloging specialist for Meesho India.
Analyze this product clothing image and extract precise attributes.
Respond strictly in JSON format with these exact keys:
{
  "category": "specific clothing item name (e.g. Kids Frock, Baby Romper, Women Kurti, Men Shirt, etc.)",
  "clothingType": "broader category (e.g. Kids Girls, Kids Boys, Baby Infant, Women Ethnic, Men Western)",
  "color": "prominent primary color name (e.g. Yellow, Navy Blue, Red, Multicolor)",
  "fabricMaterial": "probable fabric (e.g. Pure Cotton, Rayon, Silk Blend, Denim, Georgette, Chiffon)",
  "patternDesign": "pattern or work (e.g. Floral Print, Embroidered, Solid, Striped, Jaipuri Print, Polka Dot)",
  "targetAgeGender": "e.g. 6 Month To 6 Years or Women or Men",
  "size": "recommended size specification (e.g. 6 Month To 6 Years or Free Size or M L XL)",
  "keyFeatures": "3-5 high-converting selling points without commas",
  "occasion": "suitable occasions without commas (e.g. Festival Birthday Daily Wear Partywear)"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          inlineData: {
            mimeType,
            data: cleanBase64,
          },
        },
        { text: prompt },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json({ ...parsed, source: 'gemini' });
  } catch (error: any) {
    console.error('Error analyzing image:', error);
    return res.status(500).json({
      error: error.message || 'Failed to analyze product image',
      category: 'Kids Dress',
      color: 'Multicolor',
      fabricMaterial: 'Cotton Blend',
      patternDesign: 'Printed',
      size: '6 Month To 6 Years',
    });
  }
});

// 3. AI Smart Keyword Research (Helium 10 Style)
app.post('/api/suggest-keywords', async (req: Request, res: Response) => {
  try {
    const { category, targetAgeGender, color, fabric, customNotes } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({ source: 'local' });
    }

    const prompt = `You are a Helium 10 and Meesho SEO specialist.
Generate 10 real-time upgrowing keywords for this clothing product:
- Category: ${category || 'Clothing'}
- Target/Age: ${targetAgeGender || '6 Month To 6 Years'}
- Color: ${color || 'Multicolor'}
- Fabric: ${fabric || 'Cotton'}
- Extra notes: ${customNotes || 'None'}

Rules for keywords:
1. Provide a mix of:
   - High volume (50k to 2 Lakh searches/month)
   - Mid volume (15k to 50k / up to 1 Lakh searches/month)
   - Low volume (5k to 25k visits/searches)
2. Include CPR (Helium 10 8-day velocity giveaways, typically 8 to 45 units).
3. Include trendPercentage (+15% to +65%).
4. Include Hindi/Hinglish search variants popular on Meesho (like 'bacchon ke kapde', 'kurti plazo', etc.).
5. Capitalize first letter of every word (Title Case) and do not use special characters.

Return strict JSON array of objects:
[
  {
    "keyword": "string",
    "volumeTier": "high" | "mid" | "low",
    "searchVolume": number,
    "cpr": number,
    "trendPercentage": number,
    "searchesLabel": "string (e.g. '142k searches/mo' or '1.4 Lakh searches/mo')",
    "relevancyScore": number (70-99)
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    return res.json({ keywords: parsed, source: 'gemini' });
  } catch (error: any) {
    console.error('Error generating keywords:', error);
    return res.json({ source: 'fallback', error: error.message });
  }
});

// 4. AI-Enhanced Listing Generation adhering to all strict formula rules
app.post('/api/generate-listing', async (req: Request, res: Response) => {
  try {
    const {
      attributes,
      selectedKeywords,
      densityMode = '2-3-word',
      singleDensityWord,
      activeRules = [],
    } = req.body;

    const ai = getGeminiClient();

    // If Gemini is available, we can ask Gemini to enrich the copy while strictly following all rules
    if (ai) {
      const prompt = `You are the master E-Commerce Listing Optimizer for Meesho.
Generate a listing strictly adhering to these MANDATORY ALGORITHMIC RULES:

PRODUCT ATTRIBUTES:
- Category: ${attributes.category}
- Color: ${attributes.color}
- Fabric/Material/Design: ${attributes.fabricMaterial} ${attributes.patternDesign}
- Target Age/Gender: ${attributes.targetAgeGender}
- Size: ${attributes.size}
- Occasion: ${attributes.occasion}
- User Notes/Rules: ${attributes.customNotes || 'None'}
- Selected Target Keywords (3 to 5): ${JSON.stringify(selectedKeywords)}
- Density Mode: ${densityMode} (Specific target word: ${singleDensityWord || selectedKeywords[0]})

STRICT TITLE FORMULA & ORDER:
[Powerful Word] + [Color] + [Fabric/Material/Design/Pattern] + [Target Keyword] + [Support Word] + [Secondary Keyword] + [Size (Sabse Last)]
- Title must be clean, clear, communicate product details in 2-3 seconds.
- Capitalize the first letter of every word (Title Case).
- SPECIAL CHARACTERS ARE STRICTLY FORBIDDEN: Do NOT use -, /, (, ), |, ^, #, ?, %, $, @, ", =, :, *, or &.
- Must include 3 targeted keywords.
- Size MUST BE AT THE VERY END (Sabse Last).
- Maximum 170 characters.
- APPROVED POWERFUL WORDS: Latest, Designer, casual, trendy, stylish, beautiful, western, fancy, new, classic, traditional, attractive, amazing, awesome, fashionable, ethnic.
- APPROVED SUPPORT WORDS: Partywear, Daily wear, festival, wedding, occasions, Eid, Diwali, casual.
- BRAND OBJECTION STRICTLY BANNED: style, stylo, you, colour, an, indo, everyday.
- CHEAP FORBIDDEN WORDS: elegant, comfort, fabric, breathable, pretty, nice, the, in, to, comfortable, under 199.

STRICT DESCRIPTION RULES:
- The target primary keyword (${singleDensityWord || selectedKeywords[0]}) MUST appear EXACTLY 3 TIMES naturally in the description body (3x Density).
- DO NOT USE COMMAS ANYWHERE in the description body.
- Top 4 lines are very important and must be punchy without unnecessary words.
- Targeted keyword cannot be used alone, must be followed up with powerful, helping, or descriptive words.
- Bullet points detailing Product Features, Fabric & Care Instructions, Package Contents, Occasion.
- No special characters (use clean bullet points •).
- Under 1400 characters.

LSI SEARCH TERMS:
- 6 to 10 closely related search phrases, Hinglish buyer terms, and high-conversion search variants.

BACKEND SEARCH TAGS:
- Comma-separated search tags for Meesho backend.

Return STRICT JSON:
{
  "title": "string (under 170 chars, Size at end)",
  "primaryKeyword": "string",
  "descriptionBody": "string (no commas, exactly 3 occurrences of primaryKeyword, bullet points)",
  "lsiSearchTerms": ["string"],
  "backendSearchTags": ["string"],
  "powerfulWordUsed": "string",
  "supportWordUsed": "string"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ ...parsed, source: 'gemini' });
    }

    return res.json({ source: 'local' });
  } catch (error: any) {
    console.error('Error generating AI listing:', error);
    return res.json({ source: 'local', error: error.message });
  }
});

// Setup Vite or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Meesho Listing Optimizer server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
