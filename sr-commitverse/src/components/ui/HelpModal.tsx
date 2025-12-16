'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Mouse, Keyboard, Smartphone } from 'lucide-react';
import { useRepoStore } from '@/store/repoStore';

const CONTROLS = {
  mouse: [
    { action: 'Left Click + Drag', description: 'Rotate the view' },
    { action: 'Right Click + Drag', description: 'Pan the camera' },
    { action: 'Scroll', description: 'Zoom in/out' },
    { action: 'Click Commit', description: 'View commit details' },
  ],
  keyboard: [
    { action: 'Esc', description: 'Close panels' },
    { action: '?', description: 'Toggle this help' },
  ],
  touch: [
    { action: 'One Finger Drag', description: 'Rotate the view' },
    { action: 'Two Finger Drag', description: 'Pan the camera' },
    { action: 'Pinch', description: 'Zoom in/out' },
    { action: 'Tap Commit', description: 'View commit details' },
  ],
};

export function HelpModal() {
  const isOpen = useRepoStore((state) => state.isHelpOpen);
  const setHelpOpen = useRepoStore((state) => state.setHelpOpen);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setHelpOpen(false)}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="bg-white p-6 w-full max-w-lg rounded-2xl shadow-2xl border border-[var(--border-subtle)]">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">How to Navigate</h2>
                <button
                  onClick={() => setHelpOpen(false)}
                  className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mouse Controls */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3 text-[var(--accent-primary)]">
                  <Mouse className="w-5 h-5" />
                  <h3 className="font-medium">Mouse Controls</h3>
                </div>
                <div className="space-y-2">
                  {CONTROLS.mouse.map((control) => (
                    <div key={control.action} className="flex justify-between text-sm">
                      <span className="font-mono text-[var(--text-secondary)]">{control.action}</span>
                      <span className="text-[var(--text-muted)]">{control.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Keyboard Controls */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3 text-violet-500">
                  <Keyboard className="w-5 h-5" />
                  <h3 className="font-medium">Keyboard Shortcuts</h3>
                </div>
                <div className="space-y-2">
                  {CONTROLS.keyboard.map((control) => (
                    <div key={control.action} className="flex justify-between text-sm">
                      <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-[var(--text-secondary)]">
                        {control.action}
                      </span>
                      <span className="text-[var(--text-muted)]">{control.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Touch Controls */}
              <div>
                <div className="flex items-center gap-2 mb-3 text-emerald-500">
                  <Smartphone className="w-5 h-5" />
                  <h3 className="font-medium">Touch Controls (Mobile)</h3>
                </div>
                <div className="space-y-2">
                  {CONTROLS.touch.map((control) => (
                    <div key={control.action} className="flex justify-between text-sm">
                      <span className="font-mono text-[var(--text-secondary)]">{control.action}</span>
                      <span className="text-[var(--text-muted)]">{control.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setHelpOpen(false)}
                className="w-full mt-6 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Got it!
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
