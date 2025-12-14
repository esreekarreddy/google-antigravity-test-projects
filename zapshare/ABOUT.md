# 🌌 SR ZapShare

<div align="center">

**Send files like cash: no middleman, no records, just a code.**

[![Demo](https://img.shields.io/badge/Live_Demo-zapshare.sreekarreddy.com-00f0ff?style=for-the-badge&logo=vercel)](https://zapshare.sreekarreddy.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![WebRTC](https://img.shields.io/badge/WebRTC-Encrypted-red?style=for-the-badge)](https://webrtc.org)

**[Try it Live](https://zapshare.sreekarreddy.com)** • **[How it Works](#-how-it-works)** • **[Why Different](#-what-makes-sr-zapshare-different)**

</div>

---

## 💡 The Problem

Have you ever:

- Emailed a file to yourself because it was "easier"?
- Waited 20 minutes for a 500MB file to upload to Google Drive... then another 20 for someone to download it?
- Worried about what happens to your files after uploading to WeTransfer or Dropbox?
- Hit a paywall trying to send something larger than 2GB?
- Hoped your "private" files aren't being scanned by cloud providers?

**I was tired of it too.**

Every existing solution has the same fatal flaw: **your files go through someone else's servers**.

---

## ✨ The Solution

**SR ZapShare** is what file transfer should have been from the start:

✅ **Direct Device-to-Device** → Your file NEVER touches a server  
✅ **No Account Needed** → Completely anonymous  
✅ **Encrypted by Default** → WebRTC's military-grade DTLS/SRTP  
✅ **SHA-256 Verification** → Cryptographic proof of integrity  
✅ **Code Expiration** → 5-minute TTL for security  
✅ **Beautiful UX** → Cosmic Glass aesthetic  
✅ **Free Forever** → No "Pro" tier, no file size paywalls

### ⚡ How Fast?

On a good WiFi connection: **50+ MB/s**

Real performance:

- **76MB file** = ~1.5 seconds
- **500MB file** = ~10 seconds
- **1GB file** = ~20 seconds

No upload. No download. Just **streaming**.

---

## 🎯 What Makes SR ZapShare Different

### vs WeTransfer

|                 | SR ZapShare             | WeTransfer                    |
| --------------- | ----------------------- | ----------------------------- |
| **Privacy**     | 🟢 Zero-knowledge       | 🔴 Files stored 7 days        |
| **Speed**       | 🟢 Direct P2P (50 MB/s) | 🟡 Upload queue + download    |
| **Cost**        | 🟢 Free forever         | 🟡 $120/year for Pro          |
| **File Access** | 🟢 Never leaves device  | 🔴 Can be accessed by company |
| **Account**     | 🟢 None required        | 🟡 Optional (email)           |
| **Max Size**    | 🟡 500MB-1GB            | 🟢 2GB (free) / 200GB (Pro)   |

### vs Google Drive

|              | SR ZapShare              | Google Drive                  |
| ------------ | ------------------------ | ----------------------------- |
| **Privacy**  | 🟢 Zero-knowledge        | 🔴 Files scanned by AI        |
| **Speed**    | 🟢 Direct P2P            | 🟡 Upload + Download          |
| **Storage**  | 🟢 No storage needed     | 🔴 Uses your 15GB quota       |
| **Sharing**  | 🟢 Code expires in 5 min | 🟡 Link stays forever         |
| **Security** | 🟢 E2E encrypted         | 🟡 TLS only (server can read) |
| **Account**  | 🟢 None required         | 🔴 Google account required    |

### vs Dropbox

|                | SR ZapShare           | Dropbox                        |
| -------------- | --------------------- | ------------------------------ |
| **Privacy**    | 🟢 Zero-knowledge     | 🔴 Files stored on servers     |
| **Speed**      | 🟢 Direct P2P         | 🟡 Sync + Download             |
| **Cost**       | 🟢 Free               | 🟡 $120/year for Plus          |
| **Simplicity** | 🟢 Drop → Code → Done | 🔴 Install app, create account |
| **Temporary**  | 🟢 Auto-expires       | 🔴 Manual cleanup              |

---

## 🚀 How It Works

```
┌──────────┐                    ┌──────────┐
│ You      │                    │ Friend   │
│ (Sender) │                    │(Receiver)│
└────┬─────┘                    └────┬─────┘
     │                                │
     │  1. Drop File                  │
     │  → Get "Cosmic-Falcon"         │
     │                                │
     │                           2. Enter
     │                            "Cosmic-Falcon"
     │                                │
     ├────── 3. Find Each Other ──────┤
     │    (via PeerJS Signaling)      │
     │                                │
     ├───── 4. Direct Connection ─────┤
     │      (WebRTC Encrypted)        │
     │                                │
     │──── 5. Stream File (16KB) ────→│
     │       + SHA-256 Hashing        │
     │                                │
     │                           6. Download
     │                            (Verified)
     └                                ┘
```

### In Plain English:

1. **You**: Drop a file → Get code `Cosmic-Falcon`
2. **Friend**: Enters `Cosmic-Falcon` on their device
3. **Internet**: Tells you where to find each other (signaling only)
4. **Direct Link**: You connect directly via WebRTC (P2P)
5. **Transfer**: File streams encrypted from you → them (16KB chunks)
6. **Verification**: SHA-256 hash confirms file integrity
7. **Done**: They click "Download" to save the verified file

**Your file never touches any server. Ever.**

---

## 🔒 Security & Privacy

### What We Do:

✅ **Zero-Knowledge Architecture**

- Files never stored on servers
- Not even temporarily
- We literally can't access your files

✅ **WebRTC Encryption (DTLS/SRTP)**

- Military-grade encryption
- Same technology as Zoom, Google Meet
- Encrypted end-to-end by default

✅ **SHA-256 Cryptographic Hashing**

- File integrity verification
- Detects any tampering or corruption
- Mathematical proof file hasn't changed

✅ **No Tracking**

- No analytics
- No user accounts
- No IP logging
- Completely anonymous

✅ **Code Expiration**

- Codes expire after 5 minutes
- Prevents unauthorized access
- Auto-cleanup for security

✅ **Client-Side Generation**

- Codes generated in your browser
- Cryptographically random
- Never stored anywhere

### What We Don't Do:

❌ **No Cloud Storage** (files stay on your device)  
❌ **No User Accounts** (nothing to hack)  
❌ **No File Scanning** (your privacy is sacred)  
❌ **No Server Logs** (we don't track you)  
❌ **No Third-Party Analytics** (zero tracking)

---

## 🎨 Features That Matter

### 🌟 User Experience

- **Cosmic Glass Theme**: Beautiful glassmorphism design
- **Human-Readable Codes**: `Cosmic-Falcon` beats `h7g9x2k`
- **One-Click Copy**: Share codes instantly
- **Regenerate Code**: Get a new code anytime
- **Real-time Progress**: See every byte move
- **Responsive**: Works on any device

### ⚡ Performance

- **16KB Chunking**: Smooth progress, no browser freeze
- **Index-Based Ordering**: Prevents corruption
- **Handshake Protocol**: Prevents data loss
- **Manual Controls**: You decide when to send
- **Stream Processing**: No memory overflow

### 🔐 Security

- **Hash Verification**: Cryptographic integrity check
- **Chunk Ordering**: Prevents tampering
- **Auto-Expiration**: Codes die after 5 minutes
- **Error Detection**: Warns if file is corrupted
- **Graceful Failures**: Clear error messages

---

## 💭 Why I Built This

I needed to send a 1GB video to a friend.

**My options:**

1. **WeTransfer** → "Upgrade to Pro" paywall
2. **Google Drive** → 15 min upload + 15 min download = 30 minutes
3. **Dropbox** → "Out of space"
4. **Email** → LOL, 25MB limit

**I thought**: _"We're both online. Why can't it just... go DIRECTLY?"_

That's when I discovered WebRTC. It's the same technology that powers:

- Zoom video calls
- Google Meet
- Discord voice chat
- Microsoft Teams

If it can stream HD video in real-time, it can transfer files. **Directly. Encrypted. Fast.**

So I built SR ZapShare in **3 days**.

Then spent another **week** making it:

- ✅ Beautiful (Cosmic Glass UI)
- ✅ Secure (SHA-256 hashing)
- ✅ Reliable (fixed chunk ordering bug)
- ✅ User-friendly (human-readable codes)

**Now?** I use it every single day.

---

## 🎯 Who Is This For?

### 🕵️ Privacy-Conscious Users

- **Journalists** sharing sensitive sources
- **Healthcare** transferring patient data
- **Lawyers** exchanging confidential documents
- **Activists** protecting communications
- **Anyone** who values privacy

### 👨‍💻 Developers

- Large log files
- Build artifacts
- Database dumps
- Quick file exchange between machines
- No need for SCP/FTP

### 🎨 Creators

- Huge Photoshop files
- 4K video projects
- RAW photo collections
- Audio production files
- Design assets

### 💰 Everyone Else

**Why pay $10/month for file transfer when physics gives it to you for free?**

---

## 🧪 Technical Architecture

Built with modern, production-ready technologies:

### Frontend Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Modern styling
- **Framer Motion** - Butter-smooth animations

### P2P Layer

- **PeerJS** - WebRTC wrapper (simplifies complexity)
- **WebRTC** - Direct peer-to-peer connections
- **DTLS/SRTP** - Transport encryption
- **SHA-256** - File integrity hashing

### State & Testing

- **Zustand** - Lightweight state management (1KB!)
- **Jest** - Unit testing
- **React Testing Library** - Component testing

### Deployment

- **Vercel** - Edge network deployment
- **GitHub** - Version control
- **NPM** - Package management

### Why These Choices?

**PeerJS**: WebRTC is extremely complex. PeerJS abstracts it perfectly.  
**Zustand**: Redux is overkill for this. Zustand does it in 1KB.  
**Framer Motion**: Smooth animations = premium feel.  
**Vercel**: Deploy in seconds, global CDN, zero config.

---

## 📊 Performance Benchmarks

### Real-World Tests

| File Size | Transfer Time | Speed    |
| --------- | ------------- | -------- |
| 10 MB     | ~0.2 seconds  | 50 MB/s  |
| 76 MB     | ~1.5 seconds  | 50+ MB/s |
| 500 MB    | ~10 seconds   | 50 MB/s  |
| 1 GB      | ~20 seconds   | 50 MB/s  |

_Tested on WiFi with good connection. Results may vary based on network._

### Technology Stats

- **Chunk Size**: 16KB (optimal for browser streaming)
- **Latency**: Near-zero (direct P2P connection)
- **Overhead**: Minimal (WebRTC + base64 encoding)
- **Browser Support**: Chrome, Firefox, Safari, Edge

---

## 🛠️ How to Test Locally

### Method 1: Two Browsers (Easiest)

```bash
# Start dev server
npm run dev
# Opens on http://localhost:3000

# Browser 1 (Chrome):
# - Drop a file
# - Copy Warp Code (e.g., "Star-Glder")

# Browser 2 (Firefox/Safari):
# - Enter the code
# - Click Connect
# - Watch it transfer!
```

### Method 2: Two Devices (Real-World)

```bash
# On your computer:
npm run dev

# Find your local IP:
# Mac/Linux: ifconfig | grep "inet "
# Windows: ipconfig

# On your phone:
# Open http://192.168.1.X:3000
# (Replace X with your IP)

# Test computer → phone or vice versa!
```

---

## 🗺️ Roadmap

### ✅ Launched (v1.0)

- [x] WebRTC P2P transfer
- [x] SHA-256 file hashing
- [x] Code generation & expiration
- [x] Cosmic Glass UI
- [x] 16KB chunked streaming
- [x] Index-based chunk ordering
- [x] Real-time progress
- [x] Hash verification

### 🚧 Coming Soon (v1.1)

- [ ] Connection quality indicator
- [ ] Transfer speed display (MB/s)
- [ ] Better error messages
- [ ] Mobile app (PWA)

### 🔮 Future (v2.0)

- [ ] Multi-file support (zip on-the-fly)
- [ ] Pause/Resume transfers
- [ ] Password-protected codes
- [ ] Custom code names
- [ ] Transfer history (local only)
- [ ] QR code sharing

### 🏢 Enterprise (v3.0)

- [ ] Self-hosted option (Docker)
- [ ] TURN server for NAT traversal
- [ ] Audit logging (optional)
- [ ] SSO integration
- [ ] Compliance tools (HIPAA, GDPR)

---

## 🤝 Contributing

Built solo, but **contributions welcome!**

### Easy Contributions

- Add tests
- Improve documentation
- Fix typos
- Report bugs
- Suggest features

### Medium Contributions

- Better error handling
- UI/UX improvements
- Performance optimizations
- Browser compatibility fixes

### Hard Contributions

- TURN fallback for restrictive NATs
- Multi-file zip streaming
- Pause/Resume functionality
- Self-hosted signaling server

See [CONTRIBUTING.md](./CONTRIBUTING.md) (coming soon)

---

## 📜 License

**MIT** - Do whatever you want.

Just don't claim you built it. And if you improve it, consider contributing back! ❤️

---

## 🙏 Acknowledgments

**Inspiration:**

- ShareDrop (early P2P file sharing)
- Magic Wormhole (secure file transfer)
- Signal (privacy-first messaging)

**Technology:**

- PeerJS team (amazing WebRTC wrapper)
- Vercel (best deployment platform)
- WebRTC community (making P2P accessible)

**Testing:**

- Everyone who tried the beta
- Friends who tolerated my "just one more file" tests

---

## 💬 Get Involved

**Love it?** ⭐ Star the repo  
**Questions?** Open an [issue](https://github.com/esreekarreddy/google-antigravity-test-projects/issues)  
**Improvements?** Submit a PR

---

<div align="center">

**Built with ❤️ and frustration with cloud file transfer**

**SR ZapShare**: Because your files deserve to fly, not crawl through the cloud.

**[Try SR ZapShare Now →](https://zapshare.sreekarreddy.com)**

</div>
