# SR ZapShare

[![Live Demo](https://img.shields.io/badge/Live_Demo-zapshare.sreekarreddy.com-00f0ff?style=for-the-badge&logo=vercel)](https://zapshare.sreekarreddy.com)

A secure, peer-to-peer file transfer application built with Next.js and WebRTC. Send files directly between devices with zero server storage and end-to-end encryption.

> **For a detailed overview of features, security, and how SR ZapShare is unique, see [ABOUT.md](./ABOUT.md)**

## Features

- **True P2P Transfer**: Files stream directly between devices using WebRTC (DTLS/SRTP encryption).
- **No Account Required**: Completely anonymous, no signup or tracking.
- **Secure Codes**: Cryptographically random codes with 5-minute expiration.
- **Manual Controls**: "Send Now" and "Download" buttons for user control.
- **Real-time Progress**: 16KB chunked streaming with live progress bars.
- **Cosmic Glass UI**: Beautiful, modern interface with smooth animations.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **P2P**: PeerJS (WebRTC wrapper)
- **State Management**: Zustand
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Testing**: Jest + React Testing Library

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in **two different browsers** (e.g., Chrome and Firefox) to test file transfer locally.

## Testing

Run unit tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Project Structure

```
warpshare/
├── src/
│   ├── app/                  # Next.js app directory
│   ├── components/
│   │   ├── layout/          # Background, signature
│   │   └── transfer/        # Dropzone, ConnectionManager, Status
│   ├── lib/                 # Utilities (code-generator, file-hash)
│   └── store/               # Zustand state management
├── __tests__/               # Jest unit tests
└── public/                  # Static assets
```

## How It Works

1. **Sender** drops a file → Gets a unique code (e.g., `Cosmic-Falcon`)
2. **Receiver** enters the code on their device
3. **PeerJS** helps devices find each other (signaling only)
4. **WebRTC** establishes direct encrypted connection
5. **File streams** in 16KB chunks with real-time progress
6. **Receiver** clicks "Download" to save the file

No cloud servers touch your files. Ever.

## Security

- **WebRTC Encryption**: DTLS/SRTP (same as Zoom, Google Meet)
- **SHA-256 Hashing**: File integrity verification (✅ implemented)
- **No Server Storage**: Files never leave your device until you click "Send"
- **Code Expiration**: Codes expire after 5 minutes
- **Chunk Ordering**: Index-based reassembly prevents corruption

## License

MIT

---

**Built with ❤️ and frustration with cloud file transfer**
