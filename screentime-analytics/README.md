# ScreenTime Analytics

[![Live Demo](https://img.shields.io/badge/Live_Demo-screentime--analytics.sreekarreddy.com-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://screentime-analytics.sreekarreddy.com)/)

A privacy-focused Chrome Extension and web dashboard to track your browsing habits locally. This project helps you understand where your time goes on the web without compromising your privacy.

## Features

- **⏱️ Real-time Tracking**: Automatically tracks time spent on every website you visit.
- **📊 Interactive Dashboard**: Visualize your data with beautiful daily and weekly charts.
- **🔒 Privacy First**: All data is stored locally in your browser (`chrome.storage.local`). No data is ever sent to a server.
- **🌗 Dark/Light Mode**: A sleek, responsive UI that adapts to your preferences.
- **💾 Data Control**: Full control to import and export your browsing data as JSON.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Extension**: Chrome Extension Manifest V3
- **Visualization**: Recharts
- **State Management**: React Context API
- **Storage**: Chrome Local Storage API

## Getting Started

To use ScreenTime Analytics, you need to install the Chrome Extension and then use the dashboard to view your data.

### 1. Install the Chrome Extension

Since this is a developer project, the extension is not in the Chrome Web Store yet. You can install it manually:

1.  **Clone or Download** this repository.
2.  Open Chrome and navigate to `chrome://extensions/`.
3.  Toggle **Developer mode** in the top right corner.
4.  Click **Load unpacked**.
5.  Select the `screentime-analytics/extension` folder from this project.
6.  The extension icon should appear in your toolbar. It will immediately start tracking your browsing time locally.

### 2. Access the Dashboard

You can view your analytics in two ways:

**Option A: Live Dashboard (Recommended)**

1.  Go to [https://screentime-analytics.sreekarreddy.com/](https://screentime-analytics.sreekarreddy.com/).
2.  The dashboard will automatically read the data tracked by the extension (if the extension is configured to allow it, or if you are running the dashboard locally).
    - _Note: Due to browser security, the hosted Vercel app may not directly access the extension's local storage without specific configuration. For the best experience with the live demo, you can use the "Demo Mode" or import sample data._

**Option B: Local Dashboard (For full functionality)**

1.  Navigate to the project directory:
    ```bash
    cd screentime-analytics
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
4.  Open `http://localhost:5173`. The local dashboard has full access to the extension's data.

## Project Structure

```
screentime-analytics/
├── extension/          # Chrome Extension source code (Manifest V3)
├── src/                # React Dashboard source code
├── public/             # Static assets
└── vite.config.ts      # Vite configuration
```

## Privacy Policy

This project is designed with privacy as the #1 priority.

- **No Tracking**: We do not use Google Analytics or any third-party trackers.
- **Local Storage**: Your browsing history is stored only on your device.
- **Open Source**: You can inspect the code to verify that no data leaves your machine.

---

_Created by Sreekar Reddy_
