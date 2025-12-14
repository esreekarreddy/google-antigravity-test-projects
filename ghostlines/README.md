# SR GhostLine 👻

[![Live Demo](https://img.shields.io/badge/Live_Demo-ghostline.sreekarreddy.com-8b5cf6?style=for-the-badge&logo=vercel)](https://ghostline.sreekarreddy.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

> **"We can't see your data, even if we wanted to."**

A **Zero-Server**, **End-to-End Encrypted** P2P video calling application built for maximum privacy. Uses WebRTC for direct browser-to-browser video with no server involvement in the media stream.

**Live Demo**: [ghostline.sreekarreddy.com](https://ghostline.sreekarreddy.com)

---

## 🚀 Features

### Core Security

- **Zero Server Storage**: No database, no logs. When you close the tab, it's gone.
- **P2P Video (WebRTC)**: Direct browser-to-browser streaming with DTLS-SRTP encryption.
- **Ghost Codes**: 4-character ephemeral codes that auto-rotate every 2 minutes.
- **Visual Verification**: Single-word security code (e.g., `FALCON`) shown on both ends. If they match, no MITM attack is occurring.

### User Experience

- **One-Click Hosting**: Hit "Broadcast" to generate a code instantly.
- **Keyboard Entry**: Type the 4-character code to join (auto-connects on completion).
- **Mobile Optimized**: Responsive design with safe-area padding for notched phones.
- **Sound Effects**: Ring, connect, and disconnect tones using Web Audio API.

### Power Features

- **Screen Sharing**: Share your screen with one click (desktop only).
- **Manual Accept/Deny**: Incoming calls require explicit acceptance.
- **Copy Link**: Share a direct join link with `?join=true` parameter.

---

## 🛡️ How Security Works

```
┌─────────────────────────────────────────────────────────────────┐
│  GhostLine Security Architecture                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   [Host Browser]                        [Guest Browser]         │
│        │                                       │                │
│        ├─► Generate 4-char code (X92K)         │                │
│        │                                       │                │
│        ├─► SHA-256 hash code to Peer ID ───────┤                │
│        │   (obscures code from PeerJS)         │                │
│        │                                       │                │
│        ├─► Register with PeerJS ◄──────────────┤                │
│        │   (signaling only, no media)          │                │
│        │                                       │                │
│        ├─────── WebRTC Connection ─────────────┤                │
│        │   (DTLS-SRTP encrypted, P2P)          │                │
│        │                                       │                │
│   Video/Audio flows DIRECTLY between browsers                   │
│   (Never touches our servers)                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Visual Verification

When connected, both users see a **single word** in a green badge (top-left):

- Both see `FALCON` → ✅ Secure (no interception)
- Words don't match → ❌ Potential MITM attack

Click the badge to dismiss it.

---

## 🛠️ Tech Stack

| Category         | Technology               |
| ---------------- | ------------------------ |
| **Framework**    | Next.js 16 (App Router)  |
| **Language**     | TypeScript               |
| **Styling**      | Tailwind CSS v4          |
| **Real-Time**    | PeerJS (WebRTC)          |
| **State**        | Zustand                  |
| **Animations**   | CSS Keyframes            |
| **Cryptography** | Web Crypto API (SHA-256) |

---

## 📦 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/esreekarreddy/ghostlines.git
cd ghostlines

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Open two browser tabs to test
# Tab 1: http://localhost:3000 → Click "Broadcast"
# Tab 2: http://localhost:3000 → Click "Connect" → Enter the code
```

---

## 📁 Project Structure

```
ghostlines/
├── src/
│   ├── app/
│   │   ├── call/[roomId]/   # Call room page (Radar UI, controls)
│   │   ├── privacy/         # Privacy Policy (AU compliant)
│   │   ├── terms/           # Terms of Service (NSW jurisdiction)
│   │   └── page.tsx         # Landing page (Broadcast/Connect)
│   ├── components/
│   │   ├── GhostToast.tsx   # Mobile-responsive toast notifications
│   │   └── VideoStage.tsx   # Video display component
│   ├── hooks/
│   │   └── useWebRTC.ts     # WebRTC connection management
│   └── lib/
│       └── crypto.ts        # SHA-256 hashing, code generation
├── public/
│   └── icon.png             # App icon
└── README.md
```

---

## 🔒 Security Guarantees

| Claim                        | Proof                                                              |
| ---------------------------- | ------------------------------------------------------------------ |
| **No server logs**           | PeerJS signaling is ephemeral. Code is open source.                |
| **Keys never leave browser** | Peer ID is hashed client-side before signaling.                    |
| **Media is P2P**             | WebRTC mandates DTLS-SRTP. No TURN relay unless behind strict NAT. |
| **Verifiable**               | Source code available. Build and audit yourself.                   |

---

## 📜 Legal

- **Privacy Policy**: Australian Privacy Act 1988 compliant
- **Terms of Service**: NSW, Australia jurisdiction
- **Telecommunications**: Not a "carriage service" under AU law

---

## 🤖 Future Roadmap

- [ ] Self-hosted PeerJS server for maximum privacy
- [ ] Picture-in-Picture mode
- [ ] Text chat via WebRTC Data Channels
- [ ] Custom virtual backgrounds (TensorFlow.js)

---

## 📄 License

MIT License - Use freely, but don't be evil.

---

**Built by [Sreekar Reddy](https://sreekarreddy.com)** as part of the Privacy Engineering Portfolio.
