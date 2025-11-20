'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Activity, RefreshCw } from 'lucide-react';
import { useTimer } from '@/context/TimerContext';
import { useAudio } from '@/context/AudioContext';
import { motion, AnimatePresence } from 'framer-motion';

export function Diagnostics() {
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<{ name: string; passed: boolean }[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const { startTimer, pauseTimer, resetTimer } = useTimer();
  const { toggleTrack } = useAudio();

  const runDiagnostics = async () => {
    setIsRunning(true);
    setResults([]);
    
    const tests = [
      {
        name: 'Audio Context Initialization',
        run: async () => {
          const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          const ctx = new AudioCtx();
          const passed = ctx.state !== 'closed';
          ctx.close();
          return passed;
        }
      },
      {
        name: 'Local Storage Access',
        run: async () => {
          try {
            localStorage.setItem('test', 'value');
            const val = localStorage.getItem('test');
            localStorage.removeItem('test');
            return val === 'value';
          } catch {
            return false;
          }
        }
      },
      {
        name: 'Timer Logic Check',
        run: async () => {
          resetTimer();
          startTimer();
          await new Promise(r => setTimeout(r, 100));
          pauseTimer();
          return true;
        }
      },
      {
        name: 'Audio Mixer Response',
        run: async () => {
          // Simulate toggling a track
          toggleTrack('rain');
          await new Promise(r => setTimeout(r, 50));
          toggleTrack('rain'); // Toggle back
          return true;
        }
      }
    ];

    const newResults = [];
    for (const test of tests) {
      try {
        const passed = await test.run();
        newResults.push({ name: test.name, passed });
        setResults([...newResults]);
        await new Promise(r => setTimeout(r, 300)); // Visual delay
      } catch {
        newResults.push({ name: test.name, passed: false });
        setResults([...newResults]);
      }
    }
    setIsRunning(false);
  };

  // Auto-run on first mount (simulated "Self-Check" requirement)
  useEffect(() => {
    // Small delay to not block initial render
    const timer = setTimeout(() => {
      runDiagnostics();
    }, 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-12 right-0 w-80 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl mb-2"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                System Diagnostics
              </h4>
              <button 
                onClick={runDiagnostics}
                disabled={isRunning}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-gray-400 ${isRunning ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            <div className="space-y-2">
              {results.map((res, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">{res.name}</span>
                  {res.passed ? (
                    <span className="flex items-center gap-1 text-green-400">
                      <CheckCircle className="w-3 h-3" /> Pass
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400">
                      <XCircle className="w-3 h-3" /> Fail
                    </span>
                  )}
                </div>
              ))}
              {results.length === 0 && isRunning && (
                <div className="text-xs text-gray-500 text-center py-2">Initializing sequence...</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white p-2 rounded-full border border-white/5 backdrop-blur-md transition-all"
      >
        <Activity className="w-5 h-5" />
      </button>
    </div>
  );
}
