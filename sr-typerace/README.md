# SR TypeRace ⌨️

[![Live Demo](https://img.shields.io/badge/Live_Demo-typerace.sreekarreddy.com-00ff41?style=for-the-badge&logo=vercel)](https://typerace.sreekarreddy.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

> **"Race. Type. Compete."**

A **retro terminal-themed** typing speed game with practice mode, AI opponents, and **real-time P2P multiplayer**. Improve your WPM while competing against yourself, the computer, or friends online.

**Live Demo**: [typerace.sreekarreddy.com](https://typerace.sreekarreddy.com)

---

## ✨ Features

### 🎮 Game Modes

| Mode            | Description                                 |
| --------------- | ------------------------------------------- |
| **Practice**    | Type at your own pace, no pressure          |
| **Challenge**   | Race against the clock (30s/60s/120s)       |
| **VS Computer** | Compete against AI with 4 difficulty levels |
| **VS Friend**   | Real-time P2P racing using WebRTC           |

### 🤖 Computer Opponent

| Difficulty    | WPM Range | Behavior                      |
| ------------- | --------- | ----------------------------- |
| 🟢 Easy       | 30-40     | Makes mistakes, pauses often  |
| 🟡 Medium     | 50-60     | Consistent, occasional errors |
| 🟠 Hard       | 80-100    | Fast and accurate             |
| 🔴 Impossible | 120-150   | Near-perfect typing           |

The computer opponent types character-by-character with realistic timing, random pauses, and occasional errors for authenticity.

### 📝 Text Categories (70+ Passages)

| Category          | Count | Examples                                 |
| ----------------- | ----- | ---------------------------------------- |
| **Famous Quotes** | 25    | Steve Jobs, Linus Torvalds, MLK          |
| **Random Words**  | 5+    | Pangrams + dynamic generation            |
| **JavaScript**    | 15    | Arrow functions, async/await, reduce     |
| **Python**        | 15    | List comprehensions, decorators, classes |
| **TypeScript**    | 15    | Generics, interfaces, type utilities     |

### 👥 P2P Multiplayer

Race friends in real-time without any server storage:

- **4-character room codes** for easy sharing
- **SHA-256 hashed peer IDs** for security
- **Direct WebRTC connection** for low latency
- **Live progress sync** during races

### 📊 Stats & Progress

| Metric     | Description             |
| ---------- | ----------------------- |
| Best WPM   | Personal record         |
| Avg WPM    | Running average         |
| Accuracy   | Character accuracy %    |
| Day Streak | Consecutive days played |
| History    | Last 100 races stored   |

All stats stored **locally in browser** (localStorage).

---

## 🎨 Design

**Retro Terminal Theme** inspired by CRT monitors:

- **Phosphor green** (#00ff41) glow effect
- **Scanline overlay** for authenticity
- **JetBrains Mono** monospace font
- **Dark background** (#0d0d0d)
- **Mechanical keyboard** sound effects
- **Themed modals** (no browser alerts)

---

## 🛠️ Tech Stack

| Category        | Technology              |
| --------------- | ----------------------- |
| **Framework**   | Next.js 16 (App Router) |
| **Language**    | TypeScript              |
| **Styling**     | Tailwind CSS            |
| **State**       | Zustand                 |
| **Animations**  | Framer Motion           |
| **Multiplayer** | PeerJS (WebRTC)         |
| **Audio**       | Web Audio API           |
| **Storage**     | localStorage            |
| **Icons**       | Lucide React            |

---

## 📦 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/esreekarreddy/google-antigravity-test-projects.git
cd google-antigravity-test-projects/sr-typerace

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Open http://localhost:3000
```

---

## 📁 Project Structure

```
sr-typerace/
├── app/
│   ├── page.tsx              # Landing page with mode selection
│   ├── layout.tsx            # Root layout with SEO & JSON-LD
│   ├── race/                 # Solo race modes
│   ├── friend/               # P2P multiplayer page
│   ├── privacy/              # Privacy policy
│   ├── terms/                # Terms of service
│   ├── sitemap.ts            # Dynamic sitemap
│   └── robots.ts             # Robots.txt
├── components/
│   ├── typing/               # TextDisplay, TypingInput, ProgressBar, ResultsModal
│   └── ui/                   # CountdownOverlay, StatsCard, ConfirmModal
├── lib/
│   ├── texts.ts              # 70+ text passages
│   ├── typing.ts             # WPM/accuracy calculation
│   ├── computer.ts           # AI opponent simulation
│   ├── sounds.ts             # Web Audio effects
│   ├── storage.ts            # localStorage management
│   └── peer.ts               # PeerJS P2P connection
└── store/
    └── raceStore.ts          # Zustand state
```

---

## 🎮 Controls

| Action        | Key                                |
| ------------- | ---------------------------------- |
| **Type**      | Any character key                  |
| **Backspace** | Delete last character              |
| **Start**     | Click button or wait for countdown |

---

## 🔒 Privacy & Security

| Feature               | Implementation           |
| --------------------- | ------------------------ |
| **No server storage** | All data in localStorage |
| **No tracking**       | Zero cookies/analytics   |
| **No accounts**       | Anonymous play           |
| **P2P encryption**    | WebRTC DTLS-SRTP         |
| **Hashed room codes** | SHA-256 obscurity        |

---

## 🌐 SEO

- ✅ JSON-LD structured data (WebApplication, Person)
- ✅ OpenGraph & Twitter cards
- ✅ Google Search Console verification
- ✅ Dynamic sitemap
- ✅ Semantic HTML
- ✅ Robots.txt

---

## 📜 Legal

- **Privacy Policy**: Australian Privacy Act 1988 compliant
- **Terms of Service**: NSW, Australia jurisdiction

---

## 🔮 Future Enhancements

- [ ] Ghost race (race against past self)
- [ ] WPM trend chart visualization
- [ ] Custom theme colors
- [ ] Keyboard heatmap (struggle keys)
- [ ] Leaderboards (optional)

---

## 📄 License

MIT License - Use freely, attribution appreciated.

---

**Built by [Sreekar Reddy](https://sreekarreddy.com)** 🚀

