'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Play, RotateCcw, Volume2, VolumeX, Timer } from 'lucide-react';
import { TextDisplay } from '@/components/typing/TextDisplay';
import { TypingInput } from '@/components/typing/TypingInput';
import { ProgressBar } from '@/components/typing/ProgressBar';
import { ResultsModal } from '@/components/typing/ResultsModal';
import { CountdownOverlay } from '@/components/ui/CountdownOverlay';
import { getRandomPassage, TextCategory, categoryLabels } from '@/lib/texts';
import { calculateStats, difficulties } from '@/lib/typing';
import { ComputerOpponent, ComputerState } from '@/lib/computer';
import { saveRaceResult, getStats } from '@/lib/storage';
import { soundManager } from '@/lib/sounds';

type GameMode = 'practice' | 'challenge' | 'vs-computer' | 'vs-friend';
type GameStatus = 'setup' | 'countdown' | 'racing' | 'finished';
type ChallengeDuration = 30 | 60 | 120;

interface RaceGameProps {
  mode: GameMode;
}

const durationOptions: { value: ChallengeDuration; label: string }[] = [
  { value: 30, label: '30s' },
  { value: 60, label: '60s' },
  { value: 120, label: '2min' },
];

export function RaceGame({ mode }: RaceGameProps) {
  // State
  const [status, setStatus] = useState<GameStatus>('setup');
  const [category, setCategory] = useState<TextCategory>('quotes');
  const [difficulty, setDifficulty] = useState<string>('medium');
  const [targetText, setTargetText] = useState('');
  const [typedText, setTypedText] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    // Initialize from soundManager on client side
    if (typeof window !== 'undefined') {
      return soundManager.isEnabled();
    }
    return true;
  });
  
  // Challenge mode state
  const [challengeDuration, setChallengeDuration] = useState<ChallengeDuration>(60);
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [wordsTyped, setWordsTyped] = useState(0);
  
  // Computer opponent state
  const [computerState, setComputerState] = useState<ComputerState | null>(null);
  const computerRef = useRef<ComputerOpponent | null>(null);
  
  // Results
  const [showResults, setShowResults] = useState(false);
  const [won, setWon] = useState<boolean | null>(null);
  const [isPersonalBest, setIsPersonalBest] = useState(false);
  
  // Timer ref for elapsed time
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const finishRaceRef = useRef<((playerWon: boolean | null) => void) | null>(null);
  const statusRef = useRef<GameStatus>(status);

  // Keep status ref updated
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // Calculate current stats
  const stats = calculateStats(targetText, typedText, startTime);
  const progress = targetText.length > 0 ? (typedText.length / targetText.length) * 100 : 0;

  // Timer for elapsed time / countdown
  useEffect(() => {
    if (status === 'racing' && startTime) {
      timerRef.current = setInterval(() => {
        const elapsedSeconds = (Date.now() - startTime) / 1000;
        
        if (mode === 'challenge') {
          const remaining = Math.max(0, challengeDuration - elapsedSeconds);
          setTimeRemaining(remaining);
          setElapsed(elapsedSeconds);
          
          // Time's up!
          if (remaining <= 0) {
            if (finishRaceRef.current) {
              finishRaceRef.current(null);
            }
          }
        } else {
          setElapsed(elapsedSeconds);
        }
      }, 100);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [status, startTime, mode, challengeDuration]);

  // Generate enough text for challenge mode (multiple passages)
  const generateChallengeText = useCallback(() => {
    // For challenge mode, we need more text since user types for set duration
    // Generate multiple passages concatenated
    const passages: string[] = [];
    for (let i = 0; i < 5; i++) {
      passages.push(getRandomPassage(category).text);
    }
    return passages.join(' ');
  }, [category]);

  // Start the race
  const startRace = useCallback(() => {
    if (mode === 'challenge') {
      setTargetText(generateChallengeText());
      setTimeRemaining(challengeDuration);
      setWordsTyped(0);
    } else {
      const passage = getRandomPassage(category);
      setTargetText(passage.text);
    }
    
    setTypedText('');
    setStartTime(null);
    setElapsed(0);
    setComputerState(null);
    setWon(null);
    setIsPersonalBest(false);
    setShowResults(false);
    
    // Start countdown
    setStatus('countdown');
  }, [category, mode, challengeDuration, generateChallengeText]);

  // Handle countdown complete
  const handleCountdownComplete = useCallback(() => {
    setStatus('racing');
    setStartTime(Date.now());

    // Start computer opponent if in vs-computer mode
    if (mode === 'vs-computer') {
      const diffSettings = difficulties[difficulty];
      const computer = new ComputerOpponent(diffSettings, targetText, (state) => {
        setComputerState(state);
        
        // Check if computer won (use ref to avoid stale closure)
        if (state.isComplete && statusRef.current === 'racing') {
          if (finishRaceRef.current) {
            finishRaceRef.current(false);
          }
        }
      });
      computerRef.current = computer;
      computer.start();
    }
  }, [mode, difficulty, targetText]);

  // Finish the race
  const finishRace = useCallback((playerWon: boolean | null) => {
    setStatus('finished');
    setWon(playerWon);
    
    // Stop computer
    if (computerRef.current) {
      computerRef.current.stop();
    }

    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Count words typed for challenge mode
    if (mode === 'challenge') {
      const words = typedText.trim().split(/\s+/).filter(w => w.length > 0).length;
      setWordsTyped(words);
    }

    // Check personal best
    const currentStats = getStats();
    const isPB = stats.wpm > currentStats.bestWpm;
    setIsPersonalBest(isPB);

    // Play sound
    if (playerWon !== false) {
      soundManager.playSuccess();
    }

    // Save result
    saveRaceResult({
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      category,
      mode,
      duration: mode === 'challenge' ? challengeDuration : stats.elapsedTime,
      won: playerWon ?? undefined,
    });

    setShowResults(true);
  }, [stats, category, mode, challengeDuration, typedText]);

  // Keep ref updated
  useEffect(() => {
    finishRaceRef.current = finishRace;
  }, [finishRace]);

  // Handle typing
  const handleTyping = useCallback((text: string) => {
    setTypedText(text);

    // For non-challenge modes, check if complete
    if (mode !== 'challenge' && text.length === targetText.length) {
      const playerWon = mode === 'vs-computer' ? !computerState?.isComplete : null;
      finishRace(playerWon);
    }
    
    // For challenge mode, if somehow they type all text, generate more
    if (mode === 'challenge' && text.length >= targetText.length - 10) {
      setTargetText(prev => prev + ' ' + getRandomPassage(category).text);
    }
  }, [targetText, mode, computerState, finishRace, category]);

  // Play again
  const playAgain = useCallback(() => {
    setShowResults(false);
    startRace();
  }, [startRace]);

  // Toggle sound
  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    soundManager.setEnabled(newState);
  };

  // Get mode title
  const getModeTitle = () => {
    switch (mode) {
      case 'practice': return 'Practice Mode';
      case 'challenge': return 'Time Challenge';
      case 'vs-computer': return 'VS Computer';
      case 'vs-friend': return 'VS Friend';
      default: return 'TypeRace';
    }
  };

  // Format time display
  const formatTime = (seconds: number) => {
    if (mode === 'challenge') {
      // Countdown format for challenge mode
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
    }
    return `${seconds.toFixed(1)}s`;
  };

  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back</span>
        </Link>

        <h1 className="text-xl font-bold text-green-400 terminal-glow">{getModeTitle()}</h1>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className="p-2 text-gray-500 hover:text-green-400 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Setup screen */}
      {status === 'setup' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full"
        >
          {/* Duration selection (for challenge mode) */}
          {mode === 'challenge' && (
            <div className="w-full mb-6">
              <label className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                <Timer className="w-4 h-4" />
                Duration
              </label>
              <div className="grid grid-cols-3 gap-2">
                {durationOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setChallengeDuration(opt.value)}
                    className={`p-4 rounded-lg border text-lg font-bold transition-all ${
                      challengeDuration === opt.value
                        ? 'border-amber-400 text-amber-400 bg-amber-400/10'
                        : 'border-gray-700 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Category selection */}
          <div className="w-full mb-6">
            <label className="text-sm text-gray-500 mb-2 block">Text Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(categoryLabels) as TextCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                    category === cat
                      ? 'border-green-400 text-green-400 bg-green-400/10'
                      : 'border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {categoryLabels[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty selection (for vs-computer) */}
          {mode === 'vs-computer' && (
            <div className="w-full mb-6">
              <label className="text-sm text-gray-500 mb-2 block">Difficulty</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(difficulties).map(([key, diff]) => (
                  <button
                    key={key}
                    onClick={() => setDifficulty(key)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      difficulty === key
                        ? `border-current difficulty-${key} bg-current/10`
                        : 'border-gray-700 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    <span className={difficulty === key ? `difficulty-${key}` : ''}>
                      {diff.name}
                    </span>
                    <div className="text-xs opacity-60 mt-1">
                      {diff.wpmRange[0]}-{diff.wpmRange[1]} WPM
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Start button */}
          <button onClick={startRace} className="btn-primary flex items-center gap-2">
            <Play className="w-5 h-5" />
            Start Race
          </button>
        </motion.div>
      )}

      {/* Racing screen */}
      {(status === 'racing' || status === 'finished') && (
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          {/* Timer and WPM */}
          <div className="flex items-center justify-between mb-4">
            <div className={`text-3xl font-bold font-mono ${
              mode === 'challenge' && timeRemaining <= 10 
                ? 'text-red-400 animate-pulse' 
                : 'text-amber-400'
            }`}>
              {mode === 'challenge' ? formatTime(timeRemaining) : formatTime(elapsed)}
              {mode === 'challenge' && (
                <span className="text-sm font-normal text-gray-500 ml-2">remaining</span>
              )}
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-400 terminal-glow">
                {stats.wpm} <span className="text-sm font-normal text-gray-500">WPM</span>
              </div>
              <div className="text-sm text-gray-500">
                {stats.accuracy}% accuracy
              </div>
            </div>
          </div>

          {/* Challenge mode: Words typed count */}
          {mode === 'challenge' && (
            <div className="text-center text-sm text-gray-500 mb-2">
              {typedText.trim().split(/\s+/).filter(w => w.length > 0).length} words typed
            </div>
          )}

          {/* Text display */}
          <TextDisplay
            targetText={targetText}
            typedText={typedText}
            className="mb-6"
          />

          {/* Progress bars */}
          <div className="space-y-3 mb-6">
            <ProgressBar
              progress={progress}
              wpm={stats.wpm}
              label="You"
            />

            {mode === 'vs-computer' && computerState && (
              <ProgressBar
                progress={computerState.progress}
                wpm={computerState.wpm}
                label={`Computer (${difficulties[difficulty].name})`}
                isOpponent
              />
            )}
          </div>

          {/* Hidden input */}
          <TypingInput
            value={typedText}
            onChange={handleTyping}
            targetText={targetText}
            disabled={status !== 'racing'}
          />

          {/* Restart button */}
          {status === 'finished' && (
            <div className="text-center">
              <button onClick={playAgain} className="btn-secondary flex items-center gap-2 mx-auto">
                <RotateCcw className="w-4 h-4" />
                New Race
              </button>
            </div>
          )}
        </div>
      )}

      {/* Countdown overlay */}
      <CountdownOverlay
        isActive={status === 'countdown'}
        onComplete={handleCountdownComplete}
      />

      {/* Results modal */}
      <ResultsModal
        isOpen={showResults}
        wpm={stats.wpm}
        accuracy={stats.accuracy}
        duration={mode === 'challenge' ? challengeDuration : stats.elapsedTime}
        won={won}
        isPersonalBest={isPersonalBest}
        mode={mode}
        onPlayAgain={playAgain}
        wordsTyped={mode === 'challenge' ? wordsTyped : undefined}
      />
    </div>
  );
}
