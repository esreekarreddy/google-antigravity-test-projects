# DevMarks

> 🔖 A beautiful developer bookmark manager with smart tagging, collections, and more

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://devmarks.sreekarreddy.com)
[![Made with Next.js](https://img.shields.io/badge/Made%20with-Next.js%2016-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)

**Live Demo**: [devmarks.sreekarreddy.com](https://devmarks.sreekarreddy.com)

## 🚀 Overview

**SR DevMarks** is a modern, privacy-focused bookmark manager designed for developers. Organize your technical resources with smart tagging, instant search, collections, drag & drop reordering, and a beautiful dashboard interface.

**100% Client-Side** - All data stays in your browser. No accounts, no servers, no tracking.

## ✨ Features

| Feature                   | Description                                            |
| ------------------------- | ------------------------------------------------------ |
| **Smart Tagging**         | Auto-suggest tags based on URL (github.com → "github") |
| **Collections**           | Group bookmarks into project-based folders             |
| **Reading List**          | Track read/unread status, auto-mark on visit           |
| **Duplicate Detection**   | Warns when adding duplicate URLs                       |
| **Broken Link Checker**   | Detect dead bookmarks with one click                   |
| **Drag & Drop**           | Custom sort order with intuitive reordering            |
| **Shareable Collections** | Generate shareable links for collections               |
| **Chrome Extension**      | One-click save from any page                           |
| **Import/Export**         | Backup and restore with JSON files                     |
| **Responsive**            | Works beautifully on desktop, tablet, and mobile       |

## 🛠️ Tech Stack

| Technology        | Purpose                         |
| ----------------- | ------------------------------- |
| **Next.js 16**    | React framework with App Router |
| **TypeScript**    | Type-safe development           |
| **Tailwind CSS**  | Utility-first styling           |
| **Zustand**       | Lightweight state management    |
| **Framer Motion** | Smooth animations               |
| **@dnd-kit**      | Drag and drop functionality     |
| **Lucide React**  | Beautiful icons                 |
| **LocalStorage**  | Client-side data persistence    |

## 📸 Screenshots

_Coming soon_

## 🏃‍♂️ Getting Started

```bash
# Clone the repository
git clone https://github.com/esreekarreddy/sr-devmarks.git
cd sr-devmarks

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🧩 Chrome Extension

The `extension/` folder contains a Manifest V3 Chrome extension with **auto-sync**.

### How Auto-Sync Works

1.  **DevMarks tab open** → Bookmark syncs instantly
2.  **DevMarks tab closed** → Saves to pending queue, syncs when you open DevMarks
3.  **No server needed** → All sync happens via localStorage

### Install Extension (Developer Mode)

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `extension/` folder
5. Click the DevMarks icon to save any page!

## 📁 Project Structure

```
sr-devmarks/
├── app/
│   ├── api/check-link/    # Link checker API
│   ├── share/             # Shareable collection page
│   ├── privacy/           # Privacy policy
│   ├── terms/             # Terms of service
│   ├── globals.css        # Premium light theme
│   ├── layout.tsx         # Root layout with SEO
│   ├── page.tsx           # Main dashboard
│   └── icon.svg           # Custom favicon
├── components/
│   ├── AddBookmarkModal   # Add/edit with collections
│   ├── BookmarkCard       # Card with DnD, read toggle
│   ├── StatsCards         # Stats with filters
│   └── ...                # More components
├── lib/
│   └── storage.ts         # Data types & operations
├── store/
│   └── bookmarkStore.ts   # Zustand state
└── extension/             # Chrome extension
    ├── manifest.json
    ├── popup.html
    └── popup.js
```

## 🎨 Design Philosophy

- **Clean & Modern** - Light, airy design with soft shadows
- **Developer-Focused** - Built for organizing coding resources
- **Privacy-First** - No data leaves your browser
- **Feature-Rich** - Collections, DnD, link checking, sharing

## 🔒 Privacy

All your bookmarks are stored locally in your browser using localStorage. We never:

- Collect personal information
- Track your usage
- Send data to servers
- Use cookies

[Read our Privacy Policy](/privacy)

## 📄 License

MIT License - feel free to use, modify, and distribute.

## 👨‍💻 Author

Built with ☕ by [Sreekar Reddy](https://sreekarreddy.com)

- [GitHub](https://github.com/esreekarreddy)
- [LinkedIn](https://linkedin.com/in/esreekarreddy)
- [Twitter](https://twitter.com/esreekarreddy)
