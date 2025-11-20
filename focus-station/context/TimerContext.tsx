'use client';

import React, { createContext, useContext, useCallback, useEffect, useRef, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';
type TimerStatus = 'idle' | 'running' | 'paused';

interface TimerState {
  mode: TimerMode;
  timeLeft: number;
  status: TimerStatus;
  duration: number;
}

interface TimerContextType {
  state: TimerState;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setMode: (mode: TimerMode) => void;
  setCustomDuration: (mode: TimerMode, durationInMinutes: number) => void;
  progress: number; // 0 to 1
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

// Extend Window interface to include webkit prefix for Safari compatibility
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

const DEFAULT_DURATIONS = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

// Alarm sound using Web Audio API
const playAlarmSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext!)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
    // Second beep
    setTimeout(() => {
      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();
      osc2.connect(gain2);
      gain2.connect(audioContext.destination);
      osc2.frequency.value = 1000;
      osc2.type = 'sine';
      gain2.gain.setValueAtTime(0, audioContext.currentTime);
      gain2.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
      gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      osc2.start(audioContext.currentTime);
      osc2.stop(audioContext.currentTime + 0.5);
    }, 200);
  } catch (error) {
    console.error('Failed to play alarm:', error);
  }
};

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [durations, setDurations] = useLocalStorage('focus-station-durations', DEFAULT_DURATIONS);
  const [mode, setMode] = useLocalStorage<TimerMode>('focus-station-mode', 'focus');
  
  // We don't persist exact timeLeft to avoid confusion on reload, but we could.
  // For now, let's reset to duration on reload unless we want to be very sticky.
  // Requirement says "Store user presets (last timer setting...)"
  
  const [timeLeft, setTimeLeft] = useState(durations[mode]);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Update timeLeft when mode or durations change, if idle
  // REMOVED: useEffect causing cascading renders. Logic moved to handlers.

  const tick = useCallback(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        // Timer finished - play alarm
        setStatus('idle');
        playAlarmSound();
        
        // Show browser notification if permitted
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Focus Station', {
            body: mode === 'focus' ? 'Focus session complete! Time for a break.' : 'Break time over! Ready to focus?',
            icon: '/favicon.ico'
          });
        }
        
        return 0;
      }
      return prev - 1;
    });
  }, [mode]);

  useEffect(() => {
    if (status === 'running') {
      timerRef.current = setInterval(tick, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, tick]);

  const startTimer = () => {
    // Request notification permission on first start
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    setStatus('running');
  };
  const pauseTimer = () => setStatus('paused');
  const resetTimer = () => {
    setStatus('idle');
    setTimeLeft(durations[mode]);
  };

  const handleSetMode = (newMode: TimerMode) => {
    setMode(newMode);
    setStatus('idle');
    setTimeLeft(durations[newMode]);
  };

  const setCustomDuration = (targetMode: TimerMode, minutes: number) => {
    const newDuration = minutes * 60;
    setDurations(prev => ({
      ...prev,
      [targetMode]: newDuration
    }));
    
    // If we are modifying the current mode and are idle, update the display immediately
    if (targetMode === mode && status === 'idle') {
      setTimeLeft(newDuration);
    }
  };

  const progress = 1 - (timeLeft / durations[mode]);

  return (
    <TimerContext.Provider value={{
      state: { mode, timeLeft, status, duration: durations[mode] },
      startTimer,
      pauseTimer,
      resetTimer,
      setMode: handleSetMode,
      setCustomDuration,
      progress
    }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}
