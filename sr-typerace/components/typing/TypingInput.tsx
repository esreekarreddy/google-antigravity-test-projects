'use client';

import { useEffect, useRef, useCallback } from 'react';
import { soundManager } from '@/lib/sounds';

interface TypingInputProps {
  value: string;
  onChange: (value: string) => void;
  targetText: string;
  disabled?: boolean;
  onComplete?: () => void;
  onError?: () => void;
}

export function TypingInput({
  value,
  onChange,
  targetText,
  disabled = false,
  onComplete,
  onError,
}: TypingInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const prevValueRef = useRef(value);

  // Auto-focus input
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  // Play sounds on typing
  useEffect(() => {
    if (value.length > prevValueRef.current.length) {
      // New character typed
      const lastCharIndex = value.length - 1;
      if (value[lastCharIndex] === targetText[lastCharIndex]) {
        soundManager.playKeyPress();
      } else {
        soundManager.playError();
      }
    }
    prevValueRef.current = value;
  }, [value, targetText]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      // Don't allow typing past the target length
      if (newValue.length > targetText.length) {
        return;
      }

      // Block wrong characters - only allow correct ones (mandatory correction)
      if (newValue.length > value.length) {
        const newChar = newValue[newValue.length - 1];
        const expectedChar = targetText[value.length];
        if (newChar !== expectedChar) {
          soundManager.playError();
          onError?.(); // Notify parent for visual feedback
          return; // Block the input - you MUST type correctly to proceed
        }
      }

      onChange(newValue);

      // Check for completion
      if (newValue.length === targetText.length && onComplete) {
        onComplete();
      }
    },
    [onChange, targetText, value, onComplete, onError]
  );

  // Keep focus on window click
  useEffect(() => {
    const handleClick = () => {
      if (!disabled && inputRef.current) {
        inputRef.current.focus();
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [disabled]);

  // Prevent paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={handleChange}
      onPaste={handlePaste}
      disabled={disabled}
      className="typing-input"
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
    />
  );
}
