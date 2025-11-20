'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export interface SoundTrack {
  id: string;
  name: string;
  url: string;
  volume: number; // 0 to 1
  active: boolean;
}

interface AudioContextType {
  tracks: SoundTrack[];
  toggleTrack: (id: string) => void;
  setVolume: (id: string, volume: number) => void;
  masterMute: boolean;
  toggleMasterMute: () => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  resumeAudio: () => Promise<void>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const DEFAULT_TRACKS: SoundTrack[] = [
  { 
    id: 'rain', 
    name: 'Rain', 
    url: '/sounds/Rain.mp3', 
    volume: 0.4, 
    active: false 
  },
  { 
    id: 'cafe', 
    name: 'Cafe', 
    url: '/sounds/Cafe.mp3', 
    volume: 0.3, 
    active: false 
  },
  { 
    id: 'white_noise', 
    name: 'White Noise', 
    url: '/sounds/WhiteNoise.mp3', 
    volume: 0.3, 
    active: false 
  },
];

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [tracks, setTracks] = useLocalStorage<SoundTrack[]>('focus-station-tracks-v4', DEFAULT_TRACKS);
  const [masterMute, setMasterMute] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Refs to hold Audio objects
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  // Initialize Audio objects
  useEffect(() => {
    const refs = audioRefs.current;

    tracks.forEach(track => {
      if (!refs[track.id]) {
        const audio = new Audio(track.url);
        audio.loop = true;
        audio.volume = track.volume;
        audio.preload = 'auto'; // Ensure it loads immediately
        refs[track.id] = audio;
      }
    });

    // Cleanup
    return () => {
      Object.values(refs).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []); // Run once on mount

  // Handle Play/Pause and Active State changes
  useEffect(() => {
    tracks.forEach(track => {
      const audio = audioRefs.current[track.id];
      if (!audio) return;

      // Update volume
      audio.volume = masterMute ? 0 : track.volume;

      // Play or Pause based on global state and track active state
      if (isPlaying && track.active && !masterMute) {
        // Play if not already playing
        if (audio.paused) {
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              // Auto-play was prevented
              console.warn(`Playback prevented for ${track.name}. User interaction required.`, error);
            });
          }
        }
      } else {
        // Pause
        if (!audio.paused) {
          audio.pause();
        }
      }
    });
  }, [tracks, isPlaying, masterMute]);

  const toggleTrack = (id: string) => {
    setTracks(prev => prev.map(t => 
      t.id === id ? { ...t, active: !t.active } : t
    ));
  };

  const setVolume = (id: string, volume: number) => {
    setTracks(prev => prev.map(t => 
      t.id === id ? { ...t, volume } : t
    ));
    
    // Update immediate audio volume
    if (audioRefs.current[id]) {
      audioRefs.current[id].volume = masterMute ? 0 : volume;
    }
  };

  const toggleMasterMute = () => setMasterMute(prev => !prev);

  const resumeAudio = async () => {
    // Unlock audio on mobile/safari by playing and immediately pausing
    Object.values(audioRefs.current).forEach(audio => {
      audio.play().then(() => {
        audio.pause();
      }).catch(e => console.log("Audio unlock failed (normal if not active)", e));
    });
    return Promise.resolve();
  };

  return (
    <AudioContext.Provider value={{ 
      tracks, 
      toggleTrack, 
      setVolume, 
      masterMute, 
      toggleMasterMute,
      isPlaying,
      setIsPlaying,
      resumeAudio
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within a AudioProvider');
  }
  return context;
}
