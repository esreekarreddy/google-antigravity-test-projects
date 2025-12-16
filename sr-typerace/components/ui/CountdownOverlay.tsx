'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { soundManager } from '@/lib/sounds';

interface CountdownOverlayProps {
  isActive: boolean;
  onComplete: () => void;
}

export function CountdownOverlay({ isActive, onComplete }: CountdownOverlayProps) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (!isActive) {
      setCount(3);
      return;
    }

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev === 1) {
          soundManager.playGo();
          setTimeout(onComplete, 0);
          return 0;
        }
        soundManager.playTick();
        return prev - 1;
      });
    }, 1000);

    // Play initial tick
    soundManager.playTick();

    return () => clearInterval(interval);
  }, [isActive, onComplete]);

  return (
    <AnimatePresence>
      {isActive && count > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
        >
          <motion.div
            key={count}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="countdown-number"
          >
            {count}
          </motion.div>
        </motion.div>
      )}

      {isActive && count === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-7xl sm:text-9xl font-bold text-green-400"
            style={{
              textShadow: '0 0 30px #00ff41, 0 0 60px #00ff41, 0 0 90px #00ff41',
            }}
          >
            GO!
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
