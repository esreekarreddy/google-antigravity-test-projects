import type { VercelRequest, VercelResponse } from '@vercel/node';
import { timingSafeEqual } from 'crypto';

// Environment variables (Securely accessed on server)
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;
const ACCESS_KEY = process.env.VITE_ACCESS_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

// Simple rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  
  if (!entry || entry.resetTime < now) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60 * 1000 }); // 1 minute window
    return true;
  }
  
  if (entry.count >= 20) return false; // 20 requests per minute
  entry.count++;
  return true;
}

// Timing-safe comparison to prevent timing attacks
function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) {
      // Compare with itself to maintain constant time
      timingSafeEqual(bufA, bufA);
      return false;
    }
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 
             req.headers['x-real-ip'] as string || 
             'unknown';
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  try {
    const { prompt, userAccessKey } = req.body;

    // 1. Security Check: Access Key (timing-safe comparison)
    if (ACCESS_KEY) {
      if (!userAccessKey || !safeCompare(userAccessKey, ACCESS_KEY)) {
        return res.status(401).json({ error: 'Invalid access key' });
      }
    }

    // 2. Validate prompt
    if (!prompt || typeof prompt !== 'string' || prompt.length > 10000) {
      return res.status(400).json({ error: 'Invalid prompt' });
    }

    // 3. Security Check: API Key
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Service not configured' });
    }

    // 4. Call Gemini API (Server-to-Server)
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
      console.error('Gemini API Error:', response.status);
      return res.status(500).json({ error: 'Service temporarily unavailable' });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(500).json({ error: 'Empty response from AI' });
    }

    // 5. Return only the text (Hide API key and raw response)
    return res.status(200).json({ text });

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: 'Service error' });
  }
}

