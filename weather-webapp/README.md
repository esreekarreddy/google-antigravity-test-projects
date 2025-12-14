# SR Weather

A beautiful, temperature-aware weather application with AI-powered insights and glassmorphism UI.

**[Live Demo](https://sreekarreddy.com/projects/weather)**

## Features

- **Intelligent Backgrounds** - Changes based on weather AND temperature (15+ unique gradients)
- **AI Insights** - Gemini-powered weather summaries, clothing recommendations, and activity suggestions
- **Physics Particles** - Interactive rain, snow, stars with mouse avoidance
- **Glassmorphism UI** - Premium iOS-style interface
- **Fully Responsive** - Mobile to desktop

## Tech Stack

React, Vite, TypeScript, Tailwind CSS, Google Gemini AI

## Local Development

```bash
# 1. Clone and install
cd weather-webapp
npm install

# 2. (Optional) Enable AI
# Get free key from https://aistudio.google.com/apikey
cp .env.example .env.local
# Edit .env.local:
# VITE_GEMINI_API_KEY=your_key_here

# 3. Run
npm run dev
```

Visit `http://localhost:3000` (or the port shown in your terminal)

**Note:** No access key needed for local development! AI works immediately with just the Gemini key.

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add Environment Variables:
   - `VITE_GEMINI_API_KEY`: Your Gemini API Key
   - `VITE_ACCESS_KEY`: (Optional) A secret password to protect AI usage. **You can choose any password here (e.g. "mySecret123") - users will need to enter this exact password to use the AI features.**

## 🛡️ Security

This app uses a **Hybrid Security Model**:

1.  **Local Development:** Uses direct API calls for speed and ease of use.
2.  **Production (Vercel):** Automatically switches to **Serverless Functions** (`/api/gemini`).
    - Your API Key and Access Key are stored securely on the server.
    - Keys are **NEVER** exposed to the client browser.
    - Requests are proxied through the secure backend.

## Build

```bash
npm run build
npm run preview
```

## How It Works

**Dynamic Backgrounds:**

- Dubai (40°C sunny) → Desert Orange 🔥
- Sydney (25°C sunny) → Golden Yellow ☀️
- Moscow (0°C sunny) → Pale Icy Blue ❄️

**Same weather, different vibe!**

**AI Modes:**

- Summary - Weather overview
- What to Wear 👕 - Outfit recommendations
- Activities ⚽ - Activity suggestions

---

_Part of Google Antigravity Test Projects_
