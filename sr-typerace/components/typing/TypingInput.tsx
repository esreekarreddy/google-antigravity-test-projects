'use client';

import { useEffect, useRef, useCallback } from 'react';
import { soundManager } from '@/lib/sounds';

interface TypingInputProps {
  value: string;
  onChange: (value: string) => void;
  targetText: string;
  disabled?: boolean;
  onComplete?: () => void;
}

export function TypingInput({
  value,
  onChange,
  targetText,
  disabled = false,
  onComplete,
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

      onChange(newValue);

      // Check for completion
      if (newValue.length === targetText.length && onComplete) {
        onComplete();
      }
    },
    [onChange, targetText, onComplete]
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
