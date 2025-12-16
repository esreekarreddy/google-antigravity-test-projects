'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const variantStyles = {
    danger: {
      icon: 'text-red-400',
      border: 'border-red-500/30',
      bg: 'bg-red-500/10',
      button: 'bg-red-500 hover:bg-red-600',
    },
    warning: {
      icon: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
      button: 'bg-amber-500 hover:bg-amber-600',
    },
    info: {
      icon: 'text-purple-400',
      border: 'border-purple-500/30',
      bg: 'bg-purple-500/10',
      button: 'bg-purple-500 hover:bg-purple-600',
    },
  };

  const styles = variantStyles[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md terminal-panel ${styles.border} ${styles.bg} rounded-xl p-6`}
          >
            {/* Close button */}
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon and title */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${styles.bg}`}>
                <AlertTriangle className={`w-6 h-6 ${styles.icon}`} />
              </div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
            </div>

            {/* Message */}
            <p className="text-gray-400 mb-6">{message}</p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${styles.button}`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Simple alert modal (no cancel button)
interface AlertModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  buttonText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onClose: () => void;
}

export function AlertModal({
  isOpen,
  title,
  message,
  buttonText = 'OK',
  variant = 'info',
  onClose,
}: AlertModalProps) {
  const variantStyles = {
    danger: {
      icon: 'text-red-400',
      border: 'border-red-500/30',
      bg: 'bg-red-500/10',
      button: 'bg-red-500 hover:bg-red-600',
    },
    warning: {
      icon: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
      button: 'bg-amber-500 hover:bg-amber-600',
    },
    info: {
      icon: 'text-purple-400',
      border: 'border-purple-500/30',
      bg: 'bg-purple-500/10',
      button: 'bg-purple-500 hover:bg-purple-600',
    },
  };

  const styles = variantStyles[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md terminal-panel ${styles.border} ${styles.bg} rounded-xl p-6`}
          >
            {/* Icon and title */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${styles.bg}`}>
                <AlertTriangle className={`w-6 h-6 ${styles.icon}`} />
              </div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
            </div>

            {/* Message */}
            <p className="text-gray-400 mb-6">{message}</p>

            {/* Button */}
            <button
              onClick={onClose}
              className={`w-full px-4 py-2 text-white rounded-lg transition-colors ${styles.button}`}
            >
              {buttonText}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
