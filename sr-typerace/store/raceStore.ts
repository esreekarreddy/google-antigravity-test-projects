// Zustand store for race state

import { create } from 'zustand';
import { TextPassage, TextCategory } from '@/lib/texts';
import { TypingStats, calculateStats, processInput } from '@/lib/typing';
import { ComputerState } from '@/lib/computer';

export type GameMode = 'practice' | 'challenge' | 'vs-computer' | 'vs-friend';
export type GameStatus = 'idle' | 'countdown' | 'racing' | 'finished';

interface RaceState {
  // Game configuration
  mode: GameMode;
  category: TextCategory;
  difficulty: string; // For vs-computer
  timeLimitSeconds: number; // For challenge mode
  
  // Current race state
  status: GameStatus;
  passage: TextPassage | null;
  typedText: string;
  startTime: number | null;
  endTime: number | null;
  countdown: number; // 3, 2, 1, 0
  
  // Stats
  currentStats: TypingStats;
  
  // Computer opponent (for vs-computer mode)
  computerState: ComputerState | null;
  
  // P2P opponent (for vs-friend mode)
  opponentProgress: number; // 0-100
  opponentWpm: number;
  opponentFinished: boolean;
  
  // Results
  won: boolean | null;
  isPersonalBest: boolean;
  
  // Actions
  setMode: (mode: GameMode) => void;
  setCategory: (category: TextCategory) => void;
  setDifficulty: (difficulty: string) => void;
  setTimeLimit: (seconds: number) => void;
  setPassage: (passage: TextPassage) => void;
  startCountdown: () => void;
  decrementCountdown: () => void;
  startRace: () => void;
  updateTypedText: (text: string) => void;
  updateComputerState: (state: ComputerState) => void;
  updateOpponentState: (progress: number, wpm: number, finished: boolean) => void;
  finishRace: (won: boolean | null, isPB: boolean) => void;
  reset: () => void;
}

const initialStats: TypingStats = {
  wpm: 0,
  accuracy: 100,
  correctChars: 0,
  incorrectChars: 0,
  totalChars: 0,
  elapsedTime: 0,
};

export const useRaceStore = create<RaceState>((set, get) => ({
  // Initial state
  mode: 'practice',
  category: 'quotes',
  difficulty: 'medium',
  timeLimitSeconds: 60,
  
  status: 'idle',
  passage: null,
  typedText: '',
  startTime: null,
  endTime: null,
  countdown: 3,
  
  currentStats: initialStats,
  
  computerState: null,
  
  opponentProgress: 0,
  opponentWpm: 0,
  opponentFinished: false,
  
  won: null,
  isPersonalBest: false,
  
  // Actions
  setMode: (mode) => set({ mode }),
  setCategory: (category) => set({ category }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setTimeLimit: (seconds) => set({ timeLimitSeconds: seconds }),
  
  setPassage: (passage) => set({ 
    passage, 
    typedText: '', 
    currentStats: { ...initialStats, totalChars: passage.text.length } 
  }),
  
  startCountdown: () => set({ status: 'countdown', countdown: 3 }),
  
  decrementCountdown: () => {
    const { countdown } = get();
    if (countdown > 1) {
      set({ countdown: countdown - 1 });
    } else {
      set({ countdown: 0, status: 'racing', startTime: Date.now() });
    }
  },
  
  startRace: () => set({ 
    status: 'racing', 
    startTime: Date.now(),
    typedText: '',
    computerState: null,
    opponentProgress: 0,
    opponentWpm: 0,
    opponentFinished: false,
  }),
  
  updateTypedText: (text) => {
    const { passage, startTime } = get();
    if (!passage) return;
    
    const stats = calculateStats(passage.text, text, startTime);
    const { isComplete } = processInput(passage.text, text);
    
    set({ typedText: text, currentStats: stats });
    
    // Auto-finish if complete
    if (isComplete && get().status === 'racing') {
      const { mode, computerState } = get();
      let won: boolean | null = null;
      
      if (mode === 'vs-computer' && computerState) {
        won = !computerState.isComplete;
      }
      
      set({ 
        status: 'finished', 
        endTime: Date.now(),
        won,
      });
    }
  },
  
  updateComputerState: (state) => {
    set({ computerState: state });
    
    // Check if computer finished first
    if (state.isComplete && get().status === 'racing') {
      set({ 
        status: 'finished', 
        endTime: Date.now(),
        won: false,
      });
    }
  },
  
  updateOpponentState: (progress, wpm, finished) => {
    set({ opponentProgress: progress, opponentWpm: wpm, opponentFinished: finished });
    
    // Check if opponent finished first
    if (finished && get().status === 'racing') {
      set({ 
        status: 'finished', 
        endTime: Date.now(),
        won: false,
      });
    }
  },
  
  finishRace: (won, isPB) => set({ 
    status: 'finished', 
    endTime: Date.now(),
    won,
    isPersonalBest: isPB,
  }),
  
  reset: () => set({
    status: 'idle',
    passage: null,
    typedText: '',
    startTime: null,
    endTime: null,
    countdown: 3,
    currentStats: initialStats,
    computerState: null,
    opponentProgress: 0,
    opponentWpm: 0,
    opponentFinished: false,
    won: null,
    isPersonalBest: false,
  }),
}));
