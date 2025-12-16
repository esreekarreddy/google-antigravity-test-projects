// Typing engine - WPM calculation, accuracy tracking, error detection

export interface TypingStats {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  elapsedTime: number; // in seconds
}

export interface CharacterState {
  char: string;
  status: 'pending' | 'correct' | 'incorrect' | 'current';
}

// Calculate WPM (Words Per Minute)
// Standard: 5 characters = 1 word
export function calculateWPM(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0) return 0;
  const minutes = elapsedSeconds / 60;
  const words = correctChars / 5; // Standard word length
  return Math.round(words / minutes);
}

// Calculate accuracy percentage
export function calculateAccuracy(correctChars: number, totalTyped: number): number {
  if (totalTyped === 0) return 100;
  return Math.round((correctChars / totalTyped) * 100);
}

// Process typed input against target text
export function processInput(
  targetText: string,
  typedText: string
): {
  characters: CharacterState[];
  correctCount: number;
  incorrectCount: number;
  isComplete: boolean;
} {
  const characters: CharacterState[] = [];
  let correctCount = 0;
  let incorrectCount = 0;

  for (let i = 0; i < targetText.length; i++) {
    const targetChar = targetText[i];
    
    if (i < typedText.length) {
      const typedChar = typedText[i];
      if (typedChar === targetChar) {
        characters.push({ char: targetChar, status: 'correct' });
        correctCount++;
      } else {
        characters.push({ char: targetChar, status: 'incorrect' });
        incorrectCount++;
      }
    } else if (i === typedText.length) {
      characters.push({ char: targetChar, status: 'current' });
    } else {
      characters.push({ char: targetChar, status: 'pending' });
    }
  }

  const isComplete = typedText.length >= targetText.length;

  return { characters, correctCount, incorrectCount, isComplete };
}

// Calculate all typing stats
export function calculateStats(
  targetText: string,
  typedText: string,
  startTime: number | null
): TypingStats {
  const { correctCount, incorrectCount } = processInput(targetText, typedText);
  const totalTyped = typedText.length;
  const elapsedTime = startTime ? (Date.now() - startTime) / 1000 : 0;

  return {
    wpm: calculateWPM(correctCount, elapsedTime),
    accuracy: calculateAccuracy(correctCount, totalTyped),
    correctChars: correctCount,
    incorrectChars: incorrectCount,
    totalChars: targetText.length,
    elapsedTime,
  };
}

// Generate WPM for computer opponent
// Returns characters per millisecond based on target WPM
export function getTypingSpeed(wpm: number): number {
  // WPM to characters per second: (WPM * 5) / 60
  // Then to milliseconds per character: 1000 / cps
  const charsPerSecond = (wpm * 5) / 60;
  return 1000 / charsPerSecond;
}

// Computer difficulty settings
export interface DifficultySettings {
  name: string;
  wpmRange: [number, number];
  errorRate: number; // 0-1, probability of making an error
  pauseChance: number; // 0-1, probability of pausing
}

export const difficulties: Record<string, DifficultySettings> = {
  easy: {
    name: 'Easy',
    wpmRange: [30, 40],
    errorRate: 0.1,
    pauseChance: 0.15,
  },
  medium: {
    name: 'Medium',
    wpmRange: [50, 60],
    errorRate: 0.05,
    pauseChance: 0.08,
  },
  hard: {
    name: 'Hard',
    wpmRange: [80, 100],
    errorRate: 0.02,
    pauseChance: 0.03,
  },
  impossible: {
    name: 'Impossible',
    wpmRange: [120, 150],
    errorRate: 0,
    pauseChance: 0,
  },
};

// Get random WPM within difficulty range
export function getRandomWPM(difficulty: DifficultySettings): number {
  const [min, max] = difficulty.wpmRange;
  return min + Math.random() * (max - min);
}
