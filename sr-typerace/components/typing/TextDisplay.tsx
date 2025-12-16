'use client';

import { useMemo } from 'react';
import { processInput, CharacterState } from '@/lib/typing';

interface TextDisplayProps {
  targetText: string;
  typedText: string;
  className?: string;
}

export function TextDisplay({ targetText, typedText, className = '' }: TextDisplayProps) {
  const characters = useMemo(() => {
    const { characters } = processInput(targetText, typedText);
    return characters;
  }, [targetText, typedText]);

  const getCharClass = (status: CharacterState['status']): string => {
    switch (status) {
      case 'correct':
        return 'char-correct';
      case 'incorrect':
        return 'char-incorrect';
      case 'current':
        return 'char-current';
      default:
        return 'char-pending';
    }
  };

  return (
    <div className={`terminal-panel p-6 ${className}`}>
      <div className="text-lg sm:text-xl leading-relaxed tracking-wide font-mono select-none">
        {characters.map((char, index) => (
          <span
            key={index}
            className={`${getCharClass(char.status)} ${
              char.char === ' ' ? 'inline-block w-[0.5ch]' : ''
            }`}
          >
            {char.char === ' ' ? '\u00A0' : char.char}
          </span>
        ))}
      </div>
    </div>
  );
}
