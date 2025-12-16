// Computer opponent simulation
// Simulates realistic typing with configurable speed and errors

import { DifficultySettings, getRandomWPM, getTypingSpeed } from './typing';

export interface ComputerState {
  position: number; // Current character index
  wpm: number; // Current WPM
  isComplete: boolean;
  progress: number; // 0-100
}

export class ComputerOpponent {
  private difficulty: DifficultySettings;
  private targetText: string;
  private position: number = 0;
  private wpm: number;
  private intervalId: NodeJS.Timeout | null = null;
  private onUpdate: (state: ComputerState) => void;
  private startTime: number = 0;

  constructor(
    difficulty: DifficultySettings,
    targetText: string,
    onUpdate: (state: ComputerState) => void
  ) {
    this.difficulty = difficulty;
    this.targetText = targetText;
    this.wpm = getRandomWPM(difficulty);
    this.onUpdate = onUpdate;
  }

  start(): void {
    this.startTime = Date.now();
    this.position = 0;
    this.scheduleNextChar();
  }

  private scheduleNextChar(): void {
    if (this.position >= this.targetText.length) {
      this.complete();
      return;
    }

    // Base delay from WPM
    let delay = getTypingSpeed(this.wpm);

    // Add variance for realism
    delay *= 0.7 + Math.random() * 0.6; // 70% to 130% of base speed

    // Chance to pause (simulates thinking)
    if (Math.random() < this.difficulty.pauseChance) {
      delay += 200 + Math.random() * 500; // Pause 200-700ms
    }

    // Simulate errors (occasional slowdown)
    if (Math.random() < this.difficulty.errorRate) {
      delay += 100 + Math.random() * 300; // Error correction time
    }

    this.intervalId = setTimeout(() => {
      this.position++;
      this.emitUpdate();
      this.scheduleNextChar();
    }, delay);
  }

  private emitUpdate(): void {
    const elapsedSeconds = (Date.now() - this.startTime) / 1000;
    const currentWPM = elapsedSeconds > 0 
      ? Math.round((this.position / 5) / (elapsedSeconds / 60))
      : 0;

    this.onUpdate({
      position: this.position,
      wpm: currentWPM,
      isComplete: this.position >= this.targetText.length,
      progress: (this.position / this.targetText.length) * 100,
    });
  }

  private complete(): void {
    this.onUpdate({
      position: this.targetText.length,
      wpm: this.wpm,
      isComplete: true,
      progress: 100,
    });
  }

  stop(): void {
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
  }

  getState(): ComputerState {
    return {
      position: this.position,
      wpm: Math.round(this.wpm),
      isComplete: this.position >= this.targetText.length,
      progress: (this.position / this.targetText.length) * 100,
    };
  }
}
