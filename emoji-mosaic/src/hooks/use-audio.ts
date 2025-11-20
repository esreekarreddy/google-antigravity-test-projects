import { useCallback, useRef, useEffect } from 'react';

export function useAudio() {
  const audioContext = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize AudioContext on user interaction to comply with browser policies
    const initAudio = () => {
      if (!audioContext.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };

    window.addEventListener('click', initAudio, { once: true });
    return () => window.removeEventListener('click', initAudio);
  }, []);

  const playTone = useCallback((freq: number, type: OscillatorType, duration: number, vol: number = 0.1) => {
    if (!audioContext.current) return;
    
    const ctx = audioContext.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, []);

  const playClick = useCallback(() => {
    // High pitched short blip
    playTone(800, 'sine', 0.1, 0.05);
  }, [playTone]);

  const playHover = useCallback(() => {
    // Very subtle low click
    playTone(400, 'sine', 0.05, 0.02);
  }, [playTone]);

  const playSuccess = useCallback(() => {
    // Ascending arpeggio
    if (!audioContext.current) return;
    
    [440, 554, 659, 880].forEach((freq, i) => {
      setTimeout(() => playTone(freq, 'sine', 0.3, 0.05), i * 100);
    });
  }, [playTone]);

  const playError = useCallback(() => {
    // Low dissonance
    playTone(150, 'sawtooth', 0.3, 0.1);
    setTimeout(() => playTone(140, 'sawtooth', 0.3, 0.1), 100);
  }, [playTone]);

  return { playClick, playHover, playSuccess, playError };
}
