# Focus Station ⏱️🎯

A visually stunning Pomodoro timer with ambient soundscapes to enhance your productivity and focus.

## ✨ Features

- **Hexagonal Timer Design**: Beautiful animated hexagonal timer with mode-specific colors
  - Focus Mode: Purple gradient
  - Short Break: Cyan gradient
  - Long Break: Orange/Pink gradient
- **Pomodoro Technique**: 25-minute focus sessions with 5/15 minute breaks
- **Ambient Soundscapes**: Three procedurally-generated background sounds
  - Rain (filtered pink noise with droplets)
  - Cafe (brown noise with ambient activity)
  - White Noise (pure random noise)
- **Real-time Sound Mixing**: Individual volume controls and master mute
- **Timer Completion Alarm**: Audio beep + browser notification when session ends
- **Animated Background**: Particle network with connecting lines
- **LocalStorage Persistence**: Remembers your preferences and settings
- **Fully Responsive**: Works beautifully on desktop and mobile

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

## 🎨 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Audio**: Web Audio API (synthetic sound generation)
- **Icons**: Lucide React
- **State**: React Context API

## 🎵 How the Audio Works

All sounds are **procedurally generated** using the Web Audio API - no audio files needed! Each sound uses different noise algorithms:

- Rain: Pink noise with random droplet spikes
- Cafe: Brown noise (low rumble) with occasional activity bursts
- White Noise: Pure random noise

Sounds only play when the timer is running. Click a sound icon to activate it (it will glow), then start the timer.

## 📝 Usage Tips

1. Click a mode button (Focus/Short/Long) to set your session duration
2. Activate any soundscapes you want by clicking their icons (they'll glow when active)
3. Click the gradient play button to start your session
4. Focus on your work until the alarm sounds!

## 🏗️ Project Structure

```
focus-station/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles and theme
│   └── page.tsx           # Main application page
├── components/            # React components
│   ├── TimerRing.tsx     # Hexagonal timer visualization
│   ├── TimerControls.tsx # Play/pause/reset controls
│   ├── SoundMixer.tsx    # Audio track controls
│   ├── ParticlesBackground.tsx # Animated particles
│   ├── Layout.tsx        # App shell
│   ├── ErrorBoundary.tsx # Error handling
│   └── Diagnostics.tsx   # Self-test utility
├── context/              # State management
│   ├── TimerContext.tsx  # Timer state & logic
│   └── AudioContext.tsx  # Audio engine
├── hooks/                # Custom React hooks
│   └── useLocalStorage.ts
└── utils/                # Utilities
    └── cn.ts             # Class name utility
```

## 🎯 Future Enhancements

- Session statistics and streak tracking
- Custom timer durations
- More soundscape options
- Keyboard shortcuts
- Dark/light theme toggle

---

Built with ❤️ using Next.js and Web Audio API
