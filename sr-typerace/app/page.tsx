'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Keyboard, Bot, Users, Clock, Volume2, VolumeX } from 'lucide-react';
import { StatsCard } from '@/components/ui/StatsCard';
import { useState, useEffect } from 'react';
import { soundManager } from '@/lib/sounds';

export default function HomePage() {
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    setSoundEnabled(soundManager.isEnabled());
  }, []);

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    soundManager.setEnabled(newState);
    if (newState) {
      soundManager.playKeyPress();
    }
  };

  const modes = [
    {
      id: 'practice',
      title: 'Practice',
      description: 'Type at your own pace with no pressure',
      icon: Keyboard,
      href: '/race?mode=practice',
      color: 'text-green-400',
      borderColor: 'hover:border-green-400',
    },
    {
      id: 'challenge',
      title: 'Challenge',
      description: 'Race against the clock - 30s, 60s, or 120s',
      icon: Clock,
      href: '/race?mode=challenge',
      color: 'text-cyan-400',
      borderColor: 'hover:border-cyan-400',
    },
    {
      id: 'vs-computer',
      title: 'VS Computer',
      description: 'Race against an AI opponent',
      icon: Bot,
      href: '/race?mode=vs-computer',
      color: 'text-amber-400',
      borderColor: 'hover:border-amber-400',
    },
    {
      id: 'vs-friend',
      title: 'VS Friend',
      description: 'Real-time P2P racing with a friend',
      icon: Users,
      href: '/friend',
      color: 'text-purple-400',
      borderColor: 'hover:border-purple-400',
    },
  ];

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <div />
        <button
          onClick={toggleSound}
          className="p-2 text-gray-500 hover:text-green-400 transition-colors"
          title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl sm:text-7xl font-bold text-green-400 terminal-glow mb-4">
            SR TypeRace
          </h1>
          <p className="text-lg text-gray-400 font-mono">
            &gt; Race. Type. Compete._
          </p>
        </motion.div>

        {/* Mode selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl mb-12"
        >
          {modes.map((mode, index) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Link href={mode.href}>
                <div className={`mode-card ${mode.borderColor} group`}>
                  <mode.icon className={`w-10 h-10 ${mode.color} mb-4 group-hover:scale-110 transition-transform`} />
                  <h2 className={`text-lg font-bold ${mode.color} mb-2`}>{mode.title}</h2>
                  <p className="text-sm text-gray-500">{mode.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-2xl"
        >
          <StatsCard />
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="p-4 text-center space-y-2">
        <p className="text-xs text-gray-600">
          Built by{' '}
          <a
            href="https://sreekarreddy.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:underline"
          >
            Sreekar Reddy
          </a>
        </p>
        <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
          <Link href="/privacy" className="hover:text-green-400">Privacy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-green-400">Terms</Link>
        </div>
      </footer>
    </main>
  );
}
