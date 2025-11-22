# ScreenTime Analytics

A privacy-focused Chrome Extension and web dashboard to track your browsing habits locally.

## Project Structure

```
screentime-analytics/
├── extension/          # Chrome Extension (Manifest V3)
├── client/            # Web Dashboard (React + Vite)
├── package.json       # Dependencies
└── vite.config.ts     # Vite configuration
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open `http://localhost:5173` to view the dashboard.

### 3. Install Chrome Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the `extension` folder

The extension will now track your browsing activity locally.

## Build for Production

```bash
npm run build
```

This creates an optimized build in `dist/public/`.

## Deploy to Vercel

This project is configured for easy deployment on Vercel.

1. Push this repository to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Select the `screentime-analytics` root directory if asked.
4. Vercel will automatically detect the settings from `vercel.json`.
5. Click **Deploy**.

Your dashboard will be live!

## Extension Installation

To use the analytics, you need to install the Chrome Extension:

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** in the top right corner.
3. Click **Load unpacked**.
4. Select the `screentime-analytics/extension` folder from this repository.
5. The extension icon should appear in your toolbar.

> **Note**: The extension communicates with the dashboard via local storage. For the live Vercel deployment to work with the extension, you may need to update the extension's permissions or logic if it relies on specific domain matching, but currently it tracks data locally which the dashboard reads.

**Important**: The current architecture uses `chrome.storage.local` which is accessible to the extension. The dashboard (client) is a web app.

- **Local Development**: The dashboard runs on `localhost`. The extension content script can inject data or sync with it.
- **Production**: Since the dashboard is a static site, it cannot directly access `chrome.storage`. The extension needs to provide a UI or inject the dashboard into a tab.
  _Correction_: The current implementation likely uses a "New Tab" override or a popup, or expects the user to open the dashboard. If the dashboard is a separate web page, the extension needs to send data to it.
  _Self-Correction_: Looking at the code, the dashboard reads from `localStorage` (via `storage.ts`). The extension `content.js` or `background.js` must be writing to it.
  If the dashboard is deployed to Vercel, the extension running on other sites won't be able to write to the Vercel domain's localStorage unless it explicitly opens that domain and executes scripts.
  For now, this setup is primarily for **local usage** or **extension-based** usage. The Vercel deployment serves as a demo or a hosted version of the dashboard that the extension could potentially interact with in the future.

## How It Works

- **Extension**: Runs in the background and stores browsing data in `chrome.storage.local`
- **Dashboard**: Reads data from localStorage (synced by the extension's content script)
- **Privacy**: All data stays on your device - no servers, no tracking

## Features

- ⏱️ Track time spent per website
- 📊 Daily and weekly analytics
- 📈 Interactive charts (Recharts)
- 🌗 Dark/Light theme support
- 💾 Import/Export your data as JSON
- 🔒 100% local - your data never leaves your device
