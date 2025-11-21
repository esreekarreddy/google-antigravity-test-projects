'use client';

import React, { useEffect, useState } from 'react';
import { TimerProvider, useTimer } from '@/context/TimerContext';
import { AudioProvider, useAudio } from '@/context/AudioContext';
import { Layout } from '@/components/Layout';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { TimerRing } from '@/components/TimerRing';
import { TimerControls } from '@/components/TimerControls';
import { SoundMixer } from '@/components/SoundMixer';
import { Diagnostics } from '@/components/Diagnostics';
import { ParticlesBackground } from '@/components/ParticlesBackground';

function FocusStationApp() {
  const { state } = useTimer();
  const { setIsPlaying } = useAudio();
  const [timerSize, setTimerSize] = useState(300);

  // Responsive timer size
  useEffect(() => {
    const updateSize = () => {
      setTimerSize(window.innerWidth < 640 ? 240 : window.innerWidth < 768 ? 280 : 300);
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Sync audio playback with timer state
  useEffect(() => {
    setIsPlaying(state.status === 'running');
  }, [state.status, setIsPlaying]);

  return (
    <>
      <ParticlesBackground />
      <Layout>
        {/* Main Panel: Timer */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative z-10">
          <div className="w-full max-w-lg flex flex-col items-center">
            <div className="mb-4 sm:mb-6 text-center">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-primary via-accent to-secondary tracking-tight mb-1 animate-gradient">
                FOCUS STATION
              </h1>
              <p className="text-gray-400 text-xs uppercase tracking-[0.3em] font-light">
                Deep Work Environment
              </p>
            </div>
            
            {/* Responsive TimerRing */}
            <TimerRing size={timerSize} strokeWidth={10} />
            <TimerControls />
          </div>
        </div>

        {/* Side Panel: Sound */}
        <div className="w-full md:w-[380px] bg-black/10 backdrop-blur-sm p-4 sm:p-6 md:p-8 flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/5 relative z-10">
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-white/90 mb-1">Ambience</h2>
              <p className="text-xs text-gray-500 mb-4">Click sounds to enable, they play when timer runs</p>
              <SoundMixer />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default function Home() {
  return (
    <ErrorBoundary>
      <TimerProvider>
        <AudioProvider>
          <FocusStationApp />
          <Diagnostics />
          
          {/* Signature Badge */}
          <a
            href="https://github.com/esreekarreddy/google-antigravity-test-projects"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: 'fixed',
              top: '16px',
              right: '16px',
              zIndex: 1000,
              padding: '6px 12px',
              fontSize: '11px',
              fontFamily: 'monospace',
              fontWeight: 600,
              background: 'rgba(139, 92, 246, 0.1)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '20px',
              color: 'rgba(139, 92, 246, 0.9)',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
              e.currentTarget.style.color = 'rgba(168, 85, 247, 1)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
              e.currentTarget.style.color = 'rgba(139, 92, 246, 0.9)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            [SR]
          </a>
        </AudioProvider>
      </TimerProvider>
    </ErrorBoundary>
  );
}
