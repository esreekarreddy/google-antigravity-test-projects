# SR CommitVerse 🌌

[![Live Demo](https://img.shields.io/badge/Live_Demo-commitverse.sreekarreddy.com-6366f1?style=for-the-badge&logo=vercel)](https://commitverse.sreekarreddy.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

> **"Transform any GitHub repo into a stunning 3D visualization."**

A **3D Git Repository Visualizer** that displays commits as an interactive helix timeline. Explore commit history, contributor patterns, and activity insights beyond what GitHub shows.

**Live Demo**: [commitverse.sreekarreddy.com](https://commitverse.sreekarreddy.com)

---

## 🚀 Features

### Core Visualization

- **3D Helix Timeline**: Commits spiral down chronologically - newest at top, oldest at bottom.
- **Interactive Controls**: Orbit, zoom, and pan with mouse or touch.
- **Real-Time Hover**: See commit details on hover (SHA, message, author).
- **Time Slider**: Filter visualization by date range with playback animation.

### Advanced Analytics

- **Activity Heatmap**: 7×24 grid showing when contributors typically commit.
- **Commit Sparkline**: Weekly commit velocity trend chart.
- **Contributor Breakdown**: Top contributors with percentage bars.
- **Key Insights**:
  - **Velocity**: Is the project speeding up or slowing down?
  - **Merge Ratio**: % of commits from PRs/branches.
  - **Most Active**: Day and hour when most commits happen.
  - **Daily Average**: Average commits per day over repo lifetime.

### Smart Features

- **Recent Repos**: Last 5 visited repos saved in localStorage for quick re-access.
- **GitHub Token Support**: Optional PAT for 5,000 requests/hour vs 60.
- **Privacy First**: All data stays in your browser - no server storage.

---

## 🎯 What GitHub Doesn't Show

| Insight                           | GitHub | CommitVerse           |
| --------------------------------- | ------ | --------------------- |
| When contributors are most active | ❌     | ✅ Activity heatmap   |
| Commit velocity trend             | ❌     | ✅ Sparkline chart    |
| Time-filtered view                | ❌     | ✅ Interactive slider |
| 3D chronological view             | ❌     | ✅ Helix timeline     |
| Quick repo switching              | ❌     | ✅ Recent repos       |

---

## 🛠️ Tech Stack

| Category         | Technology                   |
| ---------------- | ---------------------------- |
| **Framework**    | Next.js 16 (App Router)      |
| **Language**     | TypeScript                   |
| **3D Rendering** | React Three Fiber + Three.js |
| **Styling**      | Tailwind CSS                 |
| **State**        | Zustand                      |
| **Animations**   | Framer Motion                |
| **Charts**       | Pure CSS/SVG (no library)    |

---

## 📦 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/esreekarreddy/google-antigravity-test-projects.git
cd google-antigravity-test-projects/sr-commitverse

# 2. Install dependencies
npm install

# 3. (Optional) Set up GitHub token for higher rate limits
echo "NEXT_PUBLIC_GITHUB_TOKEN=ghp_your_token" > .env.local

# 4. Run development server
npm run dev

# 5. Open http://localhost:3000
```

---

## 🔑 GitHub Token Setup (Optional)

To increase API rate limit from 60 to 5,000 requests/hour:

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Generate a new token (classic) with `public_repo` scope
3. Create `.env.local`:

```bash
NEXT_PUBLIC_GITHUB_TOKEN=ghp_your_token_here
```

> **Note**: This is FREE - the token only grants read-only access to public repos.

---

## 📁 Project Structure

```
sr-commitverse/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── layout.tsx            # Root layout + SEO
│   │   ├── visualize/page.tsx    # 3D visualization
│   │   ├── privacy/page.tsx      # Privacy policy
│   │   └── terms/page.tsx        # Terms of service
│   ├── components/
│   │   ├── charts/               # ActivityHeatmap, CommitSparkline, ContributorChart
│   │   ├── scene/                # CommitGalaxy (3D scene)
│   │   └── ui/                   # StatsPanel, TimeSlider, RecentRepos, etc.
│   ├── lib/
│   │   ├── github.ts             # GitHub API client + helix layout
│   │   └── storage.ts            # localStorage + analytics calculations
│   └── store/
│       └── repoStore.ts          # Zustand state management
├── public/
│   └── icon.svg                  # App icon
└── README.md
```

---

## 🎮 Controls

| Action          | Desktop            | Mobile          |
| --------------- | ------------------ | --------------- |
| **Rotate view** | Left click + drag  | One finger drag |
| **Pan camera**  | Right click + drag | Two finger drag |
| **Zoom**        | Scroll wheel       | Pinch           |
| **View commit** | Click              | Tap             |

---

## 🔒 Privacy & Security

| Claim                 | Proof                                                 |
| --------------------- | ----------------------------------------------------- |
| **No server storage** | All data cached in localStorage only                  |
| **No tracking**       | No cookies, no analytics, no fingerprinting           |
| **Token safety**      | GitHub token stored only in `.env.local` (gitignored) |
| **API only**          | Uses only GitHub's public REST API                    |

---

## 📊 API Limits

| Mode              | Rate Limit | Notes                         |
| ----------------- | ---------- | ----------------------------- |
| **Without Token** | 60/hour    | Based on IP address           |
| **With Token**    | 5,000/hour | Free, requires GitHub account |

- **Max Commits**: 2,000 per repository (for performance)
- **Rate Limit Reset**: Hourly

---

## 📜 Legal

- **Privacy Policy**: Australian Privacy Act 1988 compliant
- **Terms of Service**: NSW, Australia jurisdiction

---

## 📄 License

MIT License - Use freely, but don't be evil.

---

**Built by [Sreekar Reddy](https://sreekarreddy.com)** as part of the Developer Tools Portfolio.
