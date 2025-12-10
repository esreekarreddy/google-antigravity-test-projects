import { Mic, MicOff, Maximize2, Minimize2 } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface VideoStageProps {
  stream: MediaStream | null;
  isLocal?: boolean;
  label: string;
  className?: string;
  isMuted?: boolean;
}

export function VideoStage({ stream, isLocal = false, label, className, isMuted = false }: VideoStageProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={clsx(
        "relative rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl group",
        className
      )}
    >
      {/* Video Content */}
      {stream ? (
        <video
          autoPlay
          playsInline
          muted={isLocal || isMuted} // Always mute local to prevent feedback
          ref={video => {
            if (video) video.srcObject = stream;
          }}
          className={clsx(
            "w-full h-full object-cover",
            isLocal && "mirror-mode"
          )}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-zinc-950">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-zinc-700 animate-spin-slow" />
        </div>
      )}

      {/* Overlay UI (Hover only) */}
      <div className="absolute inset-x-0 bottom-0 p-4 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-end">
         <div>
             <span className="text-xs font-mono text-white/80 bg-black/40 px-2 py-1 rounded border border-white/10 backdrop-blur-md">
                 {label} {isLocal ? "(You)" : ""}
             </span>
         </div>
         
         <div className="flex gap-2">
             {isMuted && (
                 <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center border border-red-500/50">
                     <MicOff className="w-4 h-4" />
                 </div>
             )}
         </div>
      </div>
      
      {/* Recording indicator (Fake "Secure" dot) */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] uppercase tracking-widest text-emerald-500 font-mono shadow-black drop-shadow-md">
               Encrypted
           </span>
      </div>

    </motion.div>
  );
}
