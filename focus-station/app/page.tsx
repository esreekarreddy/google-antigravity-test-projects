'use client';

import React, { useEffect } from 'react';
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

  // Sync audio playback with timer state
  useEffect(() => {
    setIsPlaying(state.status === 'running');
  }, [state.status, setIsPlaying]);

  return (
    <>
      <ParticlesBackground />
      <Layout>
        {/* Main Panel: Timer */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 relative z-10">
          <div className="w-full max-w-lg flex flex-col items-center">
            <div className="mb-6 text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-primary via-accent to-secondary tracking-tight mb-1 animate-gradient">
                FOCUS STATION
              </h1>
              <p className="text-gray-400 text-xs uppercase tracking-[0.3em] font-light">
                Deep Work Environment
              </p>
            </div>
            
            <TimerRing size={300} strokeWidth={10} />
            <TimerControls />
          </div>
        </div>

        {/* Side Panel: Sound */}
        <div className="w-full md:w-[380px] bg-black/10 backdrop-blur-sm p-6 md:p-8 flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/5 relative z-10">
          <div className="space-y-6">
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
        </AudioProvider>
      </TimerProvider>
    </ErrorBoundary>
  );
}
