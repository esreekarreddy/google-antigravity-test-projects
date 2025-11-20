import React from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, Zap } from 'lucide-react';
import { useTimer } from '@/context/TimerContext';
import { useAudio } from '@/context/AudioContext';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export function TimerControls() {
  const { state, startTimer, pauseTimer, resetTimer, setMode } = useTimer();
  const { resumeAudio } = useAudio();
  const { status, mode } = state;

  const handleToggle = () => {
    if (status === 'running') {
      pauseTimer();
    } else {
      resumeAudio(); // Ensure audio context is running
      startTimer();
    }
  };

  // Mode-specific colors
  const modeStyles = {
    focus: 'from-purple-500 to-violet-600 shadow-purple-500/25',
    shortBreak: 'from-cyan-400 to-blue-500 shadow-cyan-400/25',
    longBreak: 'from-orange-400 to-pink-500 shadow-orange-400/25'
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto mt-8">
      {/* Main Controls */}
      <div className="flex items-center gap-6">
        <motion.button
          whileHover={{ scale: 1.1, rotate: -90 }}
          whileTap={{ scale: 0.9 }}
          onClick={resetTimer}
          className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/10 backdrop-blur-sm"
          aria-label="Reset Timer"
        >
          <RotateCcw className="w-4 h-4" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggle}
          className={cn(
            "relative p-5 rounded-2xl transition-all shadow-xl border border-white/20",
            "bg-gradient-to-br overflow-hidden group",
            status === 'running' 
              ? "bg-white/10 text-white" 
              : modeStyles[mode] + " text-white"
          )}
          aria-label={status === 'running' ? "Pause Timer" : "Start Timer"}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
          
          <div className="relative">
            {status === 'running' ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-0.5" />
            )}
          </div>
        </motion.button>

        <motion.button
          className="p-3 rounded-full opacity-0 pointer-events-none"
          aria-label="Spacer"
        >
          <RotateCcw className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Mode Selectors */}
      <div className="flex items-center gap-2 p-1.5 bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl">
        <ModeButton 
          active={mode === 'focus'} 
          onClick={() => setMode('focus')}
          icon={<Brain className="w-4 h-4" />}
          label="Focus"
          color="purple"
        />
        <ModeButton 
          active={mode === 'shortBreak'} 
          onClick={() => setMode('shortBreak')}
          icon={<Coffee className="w-4 h-4" />}
          label="Short"
          color="cyan"
        />
        <ModeButton 
          active={mode === 'longBreak'} 
          onClick={() => setMode('longBreak')}
          icon={<Zap className="w-4 h-4" />}
          label="Long"
          color="orange"
        />
      </div>
    </div>
  );
}

function ModeButton({ 
  active, 
  onClick, 
  icon, 
  label, 
  color 
}: { 
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  color: 'purple' | 'cyan' | 'orange';
}) {
  const colorStyles = {
    purple: active ? 'from-purple-500 to-violet-600' : '',
    cyan: active ? 'from-cyan-400 to-blue-500' : '',
    orange: active ? 'from-orange-400 to-pink-500' : ''
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2",
        active 
          ? `bg-gradient-to-r ${colorStyles[color]} text-white shadow-lg` 
          : "text-gray-400 hover:text-white hover:bg-white/5"
      )}
    >
      <span className="relative z-10 flex items-center gap-2">
        {icon}
        {label}
      </span>
    </button>
  );
}
