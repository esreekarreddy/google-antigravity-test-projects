'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Copy, Check, Wifi, WifiOff, Users } from 'lucide-react';
import { TextDisplay } from '@/components/typing/TextDisplay';
import { TypingInput } from '@/components/typing/TypingInput';
import { ProgressBar } from '@/components/typing/ProgressBar';
import { ResultsModal } from '@/components/typing/ResultsModal';
import { CountdownOverlay } from '@/components/ui/CountdownOverlay';
import { AlertModal } from '@/components/ui/ConfirmModal';
import { getRandomPassage, TextCategory, categoryLabels } from '@/lib/texts';
import { calculateStats } from '@/lib/typing';
import { saveRaceResult, getStats } from '@/lib/storage';
import { soundManager } from '@/lib/sounds';
import { RacePeer, PeerState, RaceMessage } from '@/lib/peer';

type GameStatus = 'setup' | 'waiting' | 'countdown' | 'racing' | 'finished';

export default function FriendRacePage() {
  // Connection state
  const [peerState, setPeerState] = useState<PeerState>({
    status: 'disconnected',
    roomCode: null,
    isHost: false,
    error: null,
  });
  const [joinCode, setJoinCode] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Game state
  const [status, setStatus] = useState<GameStatus>('setup');
  const [category, setCategory] = useState<TextCategory>('quotes');
  const [targetText, setTargetText] = useState('');
  const [typedText, setTypedText] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  
  // Opponent state
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [opponentWpm, setOpponentWpm] = useState(0);
  const [opponentFinished, setOpponentFinished] = useState(false);
  
  // Results
  const [showResults, setShowResults] = useState(false);
  const [won, setWon] = useState<boolean | null>(null);
  const [isPersonalBest, setIsPersonalBest] = useState(false);
  const [showDisconnectAlert, setShowDisconnectAlert] = useState(false);
  
  // Refs
  const peerRef = useRef<RacePeer | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Stats
  const stats = calculateStats(targetText, typedText, startTime);
  const progress = targetText.length > 0 ? (typedText.length / targetText.length) * 100 : 0;

  // Timer
  useEffect(() => {
    if (status === 'racing' && startTime) {
      timerRef.current = setInterval(() => {
        setElapsed((Date.now() - startTime) / 1000);
      }, 100);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, startTime]);

  // Refs for functions used in handleMessage (to avoid declaration order issues)
  const finishRaceRef = useRef<(won: boolean) => void>(() => {});
  const resetGameRef = useRef<() => void>(() => {});

  // Handle incoming messages
  const handleMessage = useCallback((message: RaceMessage) => {
    switch (message.type) {
      case 'ready':
        // Opponent is ready, start countdown
        setTargetText(message.text);
        setStatus('countdown');
        break;
      case 'start':
        // Start the race
        setStatus('racing');
        setStartTime(Date.now());
        break;
      case 'progress':
        // Update opponent progress
        setOpponentProgress((message.position / targetText.length) * 100);
        setOpponentWpm(message.wpm);
        break;
      case 'complete':
        // Opponent finished
        setOpponentFinished(true);
        if (status === 'racing') {
          finishRaceRef.current(false);
        }
        break;
      case 'rematch':
        // Opponent wants rematch
        resetGameRef.current();
        break;
    }
  }, [targetText, status]);

  // Handle opponent disconnect
  const handleDisconnect = useCallback(() => {
    if (status !== 'finished') {
      setShowDisconnectAlert(true);
    }
  }, [status]);

  // Store callbacks in refs to avoid re-creating peer
  const handleMessageRef = useRef(handleMessage);
  const handleDisconnectRef = useRef(handleDisconnect);
  
  useEffect(() => {
    handleMessageRef.current = handleMessage;
    handleDisconnectRef.current = handleDisconnect;
  }, [handleMessage, handleDisconnect]);

  // Initialize peer only once
  useEffect(() => {
    // Create peer with wrapper functions that use refs
    const peer = new RacePeer(
      setPeerState,
      (msg) => handleMessageRef.current(msg),
      () => handleDisconnectRef.current()
    );
    peerRef.current = peer;

    return () => {
      peer.disconnect();
    };
  }, []); // Empty deps - only run once

  // Create room (host)
  const createRoom = async () => {
    try {
      await peerRef.current?.createRoom();
    } catch {
      console.error('Failed to create room');
    }
  };

  // Join room (guest)
  const joinRoom = async () => {
    if (joinCode.length !== 4) return;
    try {
      await peerRef.current?.joinRoom(joinCode);
    } catch {
      console.error('Failed to join room');
    }
  };

  // Copy room code
  const copyCode = () => {
    if (peerState.roomCode) {
      navigator.clipboard.writeText(peerState.roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Start race (host only)
  const startRace = useCallback(() => {
    const passage = getRandomPassage(category);
    setTargetText(passage.text);
    setTypedText('');
    setOpponentProgress(0);
    setOpponentWpm(0);
    setOpponentFinished(false);
    
    // Tell opponent the text
    peerRef.current?.send({ type: 'ready', text: passage.text });
    setStatus('countdown');
  }, [category]);

  // Handle countdown complete
  const handleCountdownComplete = useCallback(() => {
    setStatus('racing');
    setStartTime(Date.now());
    peerRef.current?.send({ type: 'start' });
  }, []);

  // Send progress updates
  useEffect(() => {
    if (status === 'racing' && peerRef.current?.isConnected()) {
      peerRef.current.send({
        type: 'progress',
        position: typedText.length,
        wpm: stats.wpm,
      });
    }
  }, [typedText, stats.wpm, status]);

  // Finish race
  const finishRace = useCallback((playerWon: boolean) => {
    setStatus('finished');
    setWon(playerWon);
    
    if (timerRef.current) clearInterval(timerRef.current);

    // Send completion
    peerRef.current?.send({
      type: 'complete',
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      time: stats.elapsedTime,
    });

    // Check PB
    const currentStats = getStats();
    const isPB = stats.wpm > currentStats.bestWpm;
    setIsPersonalBest(isPB);

    if (playerWon) soundManager.playSuccess();

    saveRaceResult({
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      category,
      mode: 'vs-friend',
      duration: stats.elapsedTime,
      won: playerWon,
    });

    setShowResults(true);
  }, [stats, category]);

  // Keep ref updated
  useEffect(() => {
    finishRaceRef.current = finishRace;
  }, [finishRace]);

  // Handle typing
  const handleTyping = useCallback((text: string) => {
    setTypedText(text);
    if (text.length === targetText.length) {
      finishRace(!opponentFinished);
    }
  }, [targetText, opponentFinished, finishRace]);

  // Reset game
  const resetGame = useCallback(() => {
    setStatus(peerState.status === 'connected' ? 'waiting' : 'setup');
    setTypedText('');
    setOpponentProgress(0);
    setOpponentWpm(0);
    setOpponentFinished(false);
    setShowResults(false);
    setWon(null);
    setIsPersonalBest(false);
  }, [peerState.status]);

  // Keep ref updated
  useEffect(() => {
    resetGameRef.current = resetGame;
  }, [resetGame]);

  // Play again
  const playAgain = () => {
    peerRef.current?.send({ type: 'rematch' });
    if (peerState.isHost) {
      startRace();
    } else {
      resetGame();
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-green-400">
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back</span>
        </Link>
        <h1 className="text-xl font-bold text-purple-400 terminal-glow">VS Friend</h1>
        <div className="flex items-center gap-2">
          {peerState.status === 'connected' || peerState.status === 'racing' ? (
            <Wifi className="w-5 h-5 text-green-400" />
          ) : (
            <WifiOff className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </header>

      {/* Setup - Create or Join */}
      {status === 'setup' && peerState.status === 'disconnected' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full"
        >
          <Users className="w-16 h-16 text-purple-400 mb-6" />
          <h2 className="text-2xl font-bold text-white mb-8">Race a Friend</h2>

          {/* Error message */}
          {peerState.error && (
            <div className="w-full mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {peerState.error}
            </div>
          )}

          {/* Create Room */}
          <button onClick={createRoom} className="btn-primary w-full mb-6">
            Create Race Room
          </button>

          <div className="flex items-center gap-4 w-full mb-6">
            <div className="flex-1 h-px bg-gray-700" />
            <span className="text-gray-500 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-700" />
          </div>

          {/* Join Room */}
          <div className="w-full space-y-3">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 4))}
              placeholder="Enter 4-letter code"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-center text-2xl font-mono tracking-widest focus:border-purple-400 focus:outline-none"
              maxLength={4}
            />
            <button
              onClick={joinRoom}
              disabled={joinCode.length !== 4}
              className="btn-secondary w-full disabled:opacity-50"
            >
              Join Race
            </button>
          </div>
        </motion.div>
      )}

      {/* Connecting */}
      {peerState.status === 'connecting' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Connecting...</p>
          </div>
        </div>
      )}

      {/* Waiting for opponent (host) */}
      {peerState.status === 'waiting' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full"
        >
          <h2 className="text-xl font-bold text-white mb-4">Waiting for Opponent</h2>
          <p className="text-gray-400 mb-6">Share this code with your friend:</p>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="text-5xl font-mono font-bold tracking-widest text-purple-400 terminal-glow">
              {peerState.roomCode}
            </div>
            <button
              onClick={copyCode}
              className="p-2 text-gray-400 hover:text-green-400 transition-colors"
            >
              {copied ? <Check className="w-6 h-6 text-green-400" /> : <Copy className="w-6 h-6" />}
            </button>
          </div>

          <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
        </motion.div>
      )}

      {/* Connected - Category selection (host) */}
      {peerState.status === 'connected' && status === 'setup' && peerState.isHost && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full"
        >
          <div className="flex items-center gap-2 mb-6">
            <Wifi className="w-5 h-5 text-green-400" />
            <span className="text-green-400">Opponent Connected!</span>
          </div>

          <div className="w-full mb-6">
            <label className="text-sm text-gray-500 mb-2 block">Select Text Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(categoryLabels) as TextCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                    category === cat
                      ? 'border-purple-400 text-purple-400 bg-purple-400/10'
                      : 'border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {categoryLabels[cat]}
                </button>
              ))}
            </div>
          </div>

          <button onClick={startRace} className="btn-primary">
            Start Race
          </button>
        </motion.div>
      )}

      {/* Connected - Waiting for host (guest) */}
      {peerState.status === 'connected' && status === 'setup' && !peerState.isHost && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Wifi className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <p className="text-white mb-2">Connected!</p>
            <p className="text-gray-400">Waiting for host to start the race...</p>
          </div>
        </div>
      )}

      {/* Racing */}
      {(status === 'racing' || status === 'finished') && (
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          {/* Timer and WPM */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl font-bold text-amber-400">
              {elapsed.toFixed(1)}s
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-400 terminal-glow">
                {stats.wpm} <span className="text-sm font-normal text-gray-500">WPM</span>
              </div>
              <div className="text-sm text-gray-500">{stats.accuracy}% accuracy</div>
            </div>
          </div>

          <TextDisplay targetText={targetText} typedText={typedText} className="mb-6" />

          {/* Progress bars */}
          <div className="space-y-3 mb-6">
            <ProgressBar progress={progress} wpm={stats.wpm} label="You" />
            <ProgressBar
              progress={opponentProgress}
              wpm={opponentWpm}
              label="Opponent"
              isOpponent
            />
          </div>

          <TypingInput
            value={typedText}
            onChange={handleTyping}
            targetText={targetText}
            disabled={status !== 'racing'}
          />
        </div>
      )}

      {/* Countdown */}
      <CountdownOverlay isActive={status === 'countdown'} onComplete={handleCountdownComplete} />

      {/* Results */}
      <ResultsModal
        isOpen={showResults}
        wpm={stats.wpm}
        accuracy={stats.accuracy}
        duration={stats.elapsedTime}
        won={won}
        isPersonalBest={isPersonalBest}
        mode="vs-friend"
        onPlayAgain={playAgain}
      />

      {/* Disconnect Alert */}
      <AlertModal
        isOpen={showDisconnectAlert}
        title="Opponent Disconnected"
        message="Your opponent has left the race. You'll need to create a new room or join another one."
        buttonText="Back to Setup"
        variant="warning"
        onClose={() => {
          setShowDisconnectAlert(false);
          setStatus('setup');
          peerRef.current?.disconnect();
        }}
      />
    </div>
  );
}
