# ScreenTime Analytics Extension - Installation Guide

## What This Extension Does
The ScreenTime Analytics Chrome Extension tracks your browsing activity in real-time and automatically syncs it to the dashboard. It works 100% locally - no data is ever sent to any server.

## Installation Steps

### Step 1: Locate the Extension Files
The extension files are in the `extension/` folder of this project:
- `manifest.json` - Extension configuration
- `background.js` - Main tracking logic
- `utils.js` - Helper functions
- `content.js` - Dashboard sync script
- `icons/` - Extension icons

### Step 2: Open Chrome Extensions Page
1. Open **Google Chrome**
2. Click the **three dots menu** (⋮) in the top-right corner
3. Go to **More Tools** → **Extensions**
4. Or paste this in the address bar: `chrome://extensions/`

### Step 3: Enable Developer Mode
1. Look in the **top-right** corner of the Extensions page
2. Toggle **"Developer mode"** ON (it will turn blue/enabled)

### Step 4: Load the Extension
1. Click **"Load unpacked"** button that appears (top-left)
2. Navigate to the `extension/` folder in this project
3. Click **"Select Folder"** to load it

### Step 5: Verify Installation
1. You should see "ScreenTime Analytics" appear in your extensions list
2. The extension ID will be shown (e.g., `abcd1234efgh5678`)
3. Make sure it's **enabled** (toggle should be ON)

## How It Works

### Data Collection
Once installed, the extension:
- ✅ Tracks every website you visit in real-time
- ✅ Counts how long you spend on each site
- ✅ Records the number of visits per site
- ✅ Automatically syncs data to the dashboard
- ✅ Pauses tracking when you're not using the browser

### Data Flow
```
Your Browser Tabs
       ↓
Extension Background Script (tracks activity)
       ↓
Chrome Storage + LocalStorage (stores data)
       ↓
Dashboard (reads & displays)
```

### Storage Location
- **Primary**: Extension's local chrome.storage
- **Backup**: Browser's localStorage (synced for dashboard access)
- **Cloud**: None - all data stays on your computer

## Seeing Your Data

### First Time Setup
1. **Install the extension** (steps above)
2. **Keep the dashboard open** or visit it frequently
3. **Start browsing normally** - open different websites, tabs, switch between them
4. **Watch the dashboard update in real-time** - it refreshes every 5 seconds

### Timeline
- **Immediately**: Extension starts tracking as soon as you install it
- **First 5 seconds**: Dashboard detects extension activity
- **First minute**: First data appears in dashboard (after visiting 1-2 sites)
- **Ongoing**: All future browsing is automatically tracked

### What You'll See
Once data starts flowing:
- ✅ Dashboard home page shows total time and top sites
- ✅ Daily page shows today's website breakdown
- ✅ Weekly page shows 7-day trends
- ✅ Visits page shows visit frequency vs. duration
- ✅ Productivity score automatically calculates
- ✅ Settings allows data export/import

## Productivity Score Explained

### Productive Websites (100% productive)
- github.com - GitHub
- stackoverflow.com - Stack Overflow
- replit.com - Replit
- figma.com - Figma
- notion.so - Notion
- docs.google.com - Google Docs
- Local development (localhost, 127.0.0.1)
- And 5+ others

### Unproductive Websites (0% productive)
- facebook.com - Facebook
- twitter.com / x.com - Twitter
- instagram.com - Instagram
- youtube.com - YouTube
- netflix.com - Netflix
- reddit.com - Reddit
- TikTok, Twitch, and others

### Neutral Websites (50% productive)
- Everything else is considered 50% productive
- Examples: news sites, general searches, etc.

### Score Calculation
**Productivity % = (Productive Time) / (Total Time) × 100**

## Troubleshooting

### No Data Appearing?
**Problem**: Dashboard shows 0 data even though extension is installed.

**Solutions**:
1. **Refresh the dashboard** - Press F5 or Cmd+R to refresh
2. **Open a new tab** - Visit any website (e.g., google.com)
3. **Wait 5-10 seconds** - Dashboard updates every 5 seconds
4. **Check extension is enabled** - Go to `chrome://extensions/` and verify toggle is ON
5. **Check permissions** - Extension needs permission for all websites

### Extension Not Showing in Chrome?
1. Go to `chrome://extensions/`
2. Check if "Developer mode" is enabled (top-right toggle)
3. If still missing, re-load the extension:
   - Click "Load unpacked"
   - Select the `extension/` folder again

### Data Resets After Closing Browser?
**This is normal and by design**. Data is stored in:
- **Session**: Active tab tracking (lost on close)
- **Storage**: Persisted data (stays until you clear cache)

To backup data:
1. Go to **Settings** page in dashboard
2. Click **"Download JSON Backup"**
3. Your data is safely downloaded

### Performance Issues?
- The extension runs very light (minimal CPU/memory)
- Updates every 1 minute automatically
- Only tracks when you have tabs open

## Advanced Options

### Uninstall Extension
1. Go to `chrome://extensions/`
2. Find "ScreenTime Analytics"
3. Click **"Remove"** button

### Update Extension
1. Go to `chrome://extensions/`
2. Find "ScreenTime Analytics"
3. Click the **reload button** (circular arrow)

### View Extension Logs
1. Go to `chrome://extensions/`
2. Click **"Service Worker"** link under ScreenTime Analytics
3. Check the DevTools console for messages

## FAQ

**Q: Is my data private?**
A: Yes! 100% private. All data is stored locally on your computer. Nothing is sent to any server.

**Q: Can I use this with multiple browsers?**
A: Currently only Chrome/Chromium. Firefox version coming soon.

**Q: Does this work in incognito mode?**
A: By default, no. To enable:
1. Go to `chrome://extensions/`
2. Find "ScreenTime Analytics"
3. Click "Details"
4. Toggle "Allow in incognito"

**Q: Will this slow down my browser?**
A: No. The extension uses less than 1% CPU and memory.

**Q: Can I sync data across devices?**
A: Currently no. Use the export/import feature in Settings to transfer data between devices.

---

**Questions?** Check the dashboard Settings page for more options and information.
