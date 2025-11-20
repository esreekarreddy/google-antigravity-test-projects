'use client';

import React from 'react';
import { Volume2, VolumeX, Music, CloudRain, Coffee, Waves } from 'lucide-react';
import { useAudio, SoundTrack } from '@/context/AudioContext';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export function SoundMixer() {
  const { tracks, toggleTrack, setVolume, masterMute, toggleMasterMute } = useAudio();

  const getIcon = (id: string) => {
    switch (id) {
      case 'rain': return <CloudRain className="w-5 h-5" />;
      case 'cafe': return <Coffee className="w-5 h-5" />;
      case 'white_noise': return <Waves className="w-5 h-5" />;
      default: return <Music className="w-5 h-5" />;
    }
  };

  return (
    <div className="w-full bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white/80 font-medium flex items-center gap-2 text-sm">
          <Music className="w-4 h-4 text-secondary/80" />
          Soundscapes
        </h3>
        <button
          onClick={toggleMasterMute}
          className={cn(
            "p-2 rounded-lg transition-all",
            masterMute 
              ? "bg-red-500/10 text-red-400/80 hover:bg-red-500/20" 
              : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
          )}
          aria-label={masterMute ? "Unmute all" : "Mute all"}
        >
          {masterMute ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      <div className="space-y-3">
        {tracks.map((track) => (
          <TrackControl
            key={track.id}
            track={track}
            icon={getIcon(track.id)}
            onToggle={() => toggleTrack(track.id)}
            onVolumeChange={(val) => setVolume(track.id, val)}
            disabled={masterMute}
          />
        ))}
      </div>
    </div>
  );
}

function TrackControl({ 
  track, 
  icon, 
  onToggle, 
  onVolumeChange,
  disabled 
}: { 
  track: SoundTrack, 
  icon: React.ReactNode, 
  onToggle: () => void, 
  onVolumeChange: (val: number) => void,
  disabled: boolean
}) {
  return (
    <div className={cn(
      "group p-3 rounded-xl border transition-all duration-300",
      track.active 
        ? "bg-white/5 border-white/20 shadow-lg shadow-secondary/10" 
        : "bg-transparent border-transparent hover:bg-white/5"
    )}>
      <div className="flex items-center gap-3">
        <motion.button
          onClick={onToggle}
          disabled={disabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={track.active ? {
            boxShadow: [
              '0 0 0px rgba(6, 182, 212, 0)',
              '0 0 15px rgba(6, 182, 212, 0.4)',
              '0 0 0px rgba(6, 182, 212, 0)'
            ]
          } : {}}
          transition={{
            boxShadow: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          className={cn(
            "p-2.5 rounded-lg transition-all duration-300",
            track.active 
              ? "bg-secondary/30 text-secondary border border-secondary/40" 
              : "bg-white/5 text-gray-500 hover:text-gray-300 hover:bg-white/10",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          aria-label={`Toggle ${track.name}`}
        >
          {icon}
        </motion.button>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className={cn(
              "text-sm font-medium transition-colors",
              track.active ? "text-white" : "text-gray-500"
            )}>
              {track.name}
            </span>
            {track.active && (
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xs text-secondary font-medium tabular-nums"
              >
                {Math.round(track.volume * 100)}%
              </motion.span>
            )}
          </div>
          
          <div className="relative h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="absolute inset-y-0 left-0 bg-linear-to-r from-secondary to-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${track.active ? track.volume * 100 : 0}%` }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={track.volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              disabled={!track.active || disabled}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              aria-label={`${track.name} volume`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
