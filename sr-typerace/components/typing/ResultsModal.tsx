'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Frown, Zap, Target, Clock, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

interface ResultsModalProps {
  isOpen: boolean;
  wpm: number;
  accuracy: number;
  duration: number;
  won: boolean | null;
  isPersonalBest: boolean;
  mode: string;
  onPlayAgain: () => void;
}

export function ResultsModal({
  isOpen,
  wpm,
  accuracy,
  duration,
  won,
  isPersonalBest,
  mode,
  onPlayAgain,
}: ResultsModalProps) {
  const isVsMode = mode === 'vs-computer' || mode === 'vs-friend';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`w-full max-w-md ${
              won === true
                ? 'winner-banner'
                : won === false
                ? 'loser-banner'
                : 'terminal-panel-glow'
            } rounded-xl p-8`}
          >
            {/* Result header */}
            <div className="text-center mb-8">
              {isVsMode ? (
                won ? (
                  <>
                    <Trophy className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-green-400 terminal-glow">
                      VICTORY!
                    </h2>
                  </>
                ) : (
                  <>
                    <Frown className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-red-400">DEFEATED</h2>
                  </>
                )
              ) : (
                <>
                  <Zap className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-green-400 terminal-glow">
                    COMPLETE!
                  </h2>
                </>
              )}

              {isPersonalBest && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="mt-2 inline-block px-4 py-1 bg-amber-500/20 border border-amber-500 rounded-full"
                >
                  <span className="text-amber-400 font-bold">🎉 NEW PERSONAL BEST!</span>
                </motion.div>
              )}
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Zap className="w-5 h-5 text-green-400" />
                </div>
                <div className="stat-value">{wpm}</div>
                <div className="stat-label">WPM</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="stat-value text-cyan-400" style={{ textShadow: '0 0 10px rgba(0, 255, 255, 0.5)' }}>
                  {accuracy}%
                </div>
                <div className="stat-label">Accuracy</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                </div>
                <div className="stat-value text-amber-400" style={{ textShadow: '0 0 10px rgba(255, 184, 0, 0.5)' }}>
                  {duration.toFixed(1)}s
                </div>
                <div className="stat-label">Time</div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={onPlayAgain} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Play Again
              </button>
              <Link href="/" className="btn-secondary flex-1 flex items-center justify-center gap-2">
                <Home className="w-4 h-4" />
                Home
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
