import type { VercelRequest, VercelResponse } from '@vercel/node';

// Environment variables (Securely accessed on server)
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;
const ACCESS_KEY = process.env.VITE_ACCESS_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, userAccessKey } = req.body;

    // 1. Security Check: Access Key
    // If ACCESS_KEY is set in env, user must provide matching key
    if (ACCESS_KEY && userAccessKey !== ACCESS_KEY) {
      return res.status(401).json({ error: 'Invalid access key' });
    }

    // 2. Security Check: API Key
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Server configuration error: API key missing' });
    }

    // 3. Call Gemini API (Server-to-Server)
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 300,
          topP: 0.95,
          topK: 40
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      return res.status(500).json({ error: 'Failed to fetch from Gemini' });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(500).json({ error: 'Empty response from AI' });
    }

    // 4. Return only the text (Hide API key and raw response)
    return res.status(200).json({ text });

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
