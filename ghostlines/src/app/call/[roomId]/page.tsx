"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useWebRTC } from '@/hooks/useWebRTC';
import { hashPeerId, generateGhostCode, generateSecurityCode } from '@/lib/crypto';
import { Mic, Video, PhoneOff, RefreshCw, Copy, Radio, Phone, Monitor } from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';
import { GhostToaster, useToast } from '@/components/GhostToast';
import { VideoStage } from '@/components/VideoStage';

const CODE_TTL_SECONDS = 120; // 2 minutes

// ========== SOUND EFFECTS ==========
const playSound = (type: 'ring' | 'connect' | 'disconnect') => {
  // Use Web Audio API for sounds (no external files needed)
  try {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Very quiet sounds - just subtle feedback
    switch (type) {
      case 'ring':
        oscillator.frequency.value = 440;
        gainNode.gain.value = 0.03;
        oscillator.start();
        setTimeout(() => oscillator.stop(), 150);
        break;
      case 'connect':
        oscillator.frequency.value = 880;
        gainNode.gain.value = 0.03;
        oscillator.start();
        setTimeout(() => { oscillator.frequency.value = 1100; }, 80);
        setTimeout(() => oscillator.stop(), 150);
        break;
      case 'disconnect':
        oscillator.frequency.value = 300;
        gainNode.gain.value = 0.03;
        oscillator.start();
        setTimeout(() => oscillator.stop(), 200);
        break;
    }
  } catch {
    // Audio not supported, fail silently
  }
};

export default function CallRoom() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomIdParam = params.roomId as string;
  const { addToast } = useToast();
  
  // Check if this is a joiner (has ?join=true)
  const isJoiner = searchParams.get('join') === 'true';
  
  // Extract Ghost Code from URL (e.g., "ghost-X92K" -> "X92K")
  const ghostCode = roomIdParam.startsWith('ghost-') ? roomIdParam.replace('ghost-', '') : null;
  
  // State
  const [hashedPeerId, setHashedPeerId] = useState<string | null>(null);
  const [hostHashedId, setHostHashedId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(CODE_TTL_SECONDS);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [securityCode, setSecurityCode] = useState<string | null>(null);
  const hasDialed = useRef(false);
  const prevConnectionState = useRef<string>('idle');

  // Compute hashed Peer ID on mount
  useEffect(() => {
    if (ghostCode) {
      hashPeerId(ghostCode).then((hash) => {
        if (isJoiner) {
          setHostHashedId(hash);
          const joinerId = `j${Date.now().toString(36)}`;
          setHashedPeerId(joinerId);
        } else {
          setHashedPeerId(hash.substring(0, 32));
        }
      });
    }
  }, [ghostCode, isJoiner]);

  // WebRTC Hook
  const {
    peerId,
    remotePeerId,
    connectionState,
    localStream,
    remoteStream,
    incomingCall,
    answerIncomingCall,
    rejectIncomingCall,
    startCall,
    endCall,
    toggleAudio,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
    isScreenSharing
  } = useWebRTC(hashedPeerId || '');

  // ========== SOUND EFFECTS ON STATE CHANGE ==========
  useEffect(() => {
    if (incomingCall) playSound('ring');
  }, [incomingCall]);

  useEffect(() => {
    if (prevConnectionState.current !== 'connected' && connectionState === 'connected') {
      playSound('connect');
    } else if (prevConnectionState.current === 'connected' && connectionState !== 'connected') {
      playSound('disconnect');
    }
    prevConnectionState.current = connectionState;
  }, [connectionState]);

  // ========== COMPUTE SECURITY CODE WHEN CONNECTED ==========
  useEffect(() => {
    // Use the actual remotePeerId from the WebRTC hook
    if (connectionState === 'connected' && peerId && remotePeerId) {
      console.log(`[Security] Computing code: local=${peerId}, remote=${remotePeerId}`);
      generateSecurityCode(peerId, remotePeerId).then(code => {
        setSecurityCode(code);
      });
    }
  }, [connectionState, peerId, remotePeerId]);

  // Regenerate Code
  const regenerateCode = useCallback(() => {
    const newCode = generateGhostCode();
    addToast('info', `New code: ${newCode}`);
    router.replace(`/call/ghost-${newCode}`);
  }, [addToast, router]);

  // Auto-dial for joiner
  useEffect(() => {
    if (isJoiner && peerId && hostHashedId && connectionState === 'idle' && !hasDialed.current) {
      hasDialed.current = true;
      addToast('info', 'Dialing host...');
      startCall(hostHashedId.substring(0, 32));
    }
  }, [isJoiner, peerId, hostHashedId, connectionState, addToast, startCall]);

  // Countdown Timer (hosts only)
  useEffect(() => {
    if (isJoiner) return;
    if (connectionState === 'connected') return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          regenerateCode();
          return CODE_TTL_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [connectionState, regenerateCode, isJoiner]);

  // Copy shareable link
  const copyLink = () => {
    const baseUrl = window.location.href.split('?')[0];
    const shareableLink = `${baseUrl}?join=true`;
    navigator.clipboard.writeText(shareableLink);
    addToast('success', 'Invite Link Copied');
  };

  // Toggle handlers
  const handleToggleAudio = () => {
    toggleAudio();
    setIsAudioMuted(!isAudioMuted);
  };

  const handleToggleVideo = () => {
    toggleVideo();
    setIsVideoOff(!isVideoOff);
  };

  // Answer with sound
  const handleAnswer = () => {
    playSound('connect');
    answerIncomingCall();
  };

  // Reject with sound
  const handleReject = () => {
    playSound('disconnect');
    rejectIncomingCall();
  };

  // Format time
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="h-dvh bg-black text-white relative overflow-hidden flex flex-col touch-none">
       <GhostToaster />
       
       {/* ======== Security Code Badge (when connected) ======== */}
       {connectionState === 'connected' && securityCode && (
           <div className="fixed top-4 left-4 z-40 bg-emerald-900/90 backdrop-blur-md border border-emerald-500/40 rounded-full px-3 py-1.5 flex items-center gap-2 shadow-lg shadow-emerald-500/20">
               <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
               <span className="text-xs sm:text-sm font-mono font-bold text-emerald-100 tracking-wider">{securityCode}</span>
           </div>
       )}
       
       {/* ======== Incoming Call Modal ======== */}
       {incomingCall && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg animate-in fade-in p-4">
                <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-700 p-6 sm:p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <Phone className="w-10 h-10 sm:w-12 sm:h-12" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold mb-2">Incoming Call</h2>
                    <p className="text-zinc-400 text-xs sm:text-sm mb-6 sm:mb-8 font-mono">
                      Peer: {incomingCall.peer.substring(0, 8)}...
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <button 
                            onClick={handleReject}
                            className="bg-red-500/10 text-red-500 hover:bg-red-500/20 active:scale-95 py-4 sm:py-5 rounded-xl font-bold transition-all border border-red-500/20 text-lg"
                        >
                            Decline
                        </button>
                        <button 
                            onClick={handleAnswer}
                            className="bg-emerald-500 text-black hover:bg-emerald-400 active:scale-95 py-4 sm:py-5 rounded-xl font-bold transition-all text-lg"
                        >
                            Accept
                        </button>
                    </div>
                </div>
            </div>
       )}

       {/* ======== Main Content ======== */}
       <main className="flex-1 relative flex items-center justify-center p-4">
          
          {/* ======== Radar / Waiting State (HOST ONLY) ======== */}
          {connectionState !== 'connected' && ghostCode && !isJoiner && (
              <div className="absolute z-10 flex flex-col items-center gap-4 sm:gap-6 animate-in fade-in px-4 text-center">
                  
                  {/* Radar Animation - smaller on mobile */}
                  <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
                      <div className="absolute w-full h-full border border-emerald-500/20 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
                      <div className="absolute w-3/4 h-3/4 border border-emerald-500/30 rounded-full animate-ping" style={{ animationDuration: '2.5s' }} />
                      <div className="absolute w-1/2 h-1/2 border border-emerald-500/40 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                      <div className="w-16 h-16 sm:w-24 sm:h-24 bg-emerald-900/50 border-2 border-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                          <Radio className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400 animate-pulse" />
                      </div>
                  </div>
                  
                  {/* Code Display */}
                  <div className="text-center">
                      <p className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest mb-2 font-mono">Your Signal</p>
                      <div 
                        className="text-4xl sm:text-6xl font-black tracking-[0.2em] sm:tracking-[0.3em] text-transparent bg-clip-text bg-linear-to-b from-white to-zinc-400 font-mono cursor-pointer hover:opacity-80 transition-opacity select-all"
                        onClick={() => { navigator.clipboard.writeText(ghostCode); addToast('success', 'Code Copied!'); }}
                      >
                          {ghostCode}
                      </div>
                  </div>

                  {/* Timer & Actions - stacked on mobile */}
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-2 sm:mt-4">
                      <span className={clsx("font-mono text-xs sm:text-sm px-3 py-1.5 rounded-full border", timeLeft <= 30 ? "text-red-400 border-red-400/50 bg-red-900/20" : "text-zinc-400 border-zinc-700 bg-zinc-800/50")}>
                          {formatTime(timeLeft)}
                      </span>
                      <button onClick={regenerateCode} className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-zinc-800 hover:bg-zinc-700 active:scale-95 rounded-full text-xs sm:text-sm font-medium transition-all">
                          <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> New
                      </button>
                       <button onClick={copyLink} className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-zinc-800 hover:bg-zinc-700 active:scale-95 rounded-full text-xs sm:text-sm font-medium transition-all">
                          <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Link
                      </button>
                  </div>

                  <p className="text-[10px] sm:text-xs text-zinc-600 font-mono mt-2 sm:mt-4">Scanning for peers...</p>
              </div>
          )}

          {/* ======== Connecting State (JOINER ONLY) ======== */}
          {connectionState !== 'connected' && isJoiner && (
              <div className="absolute z-10 flex flex-col items-center gap-4 sm:gap-6 animate-in fade-in">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                  <div className="text-center">
                      <h2 className="text-xl sm:text-2xl font-bold mb-2">Connecting...</h2>
                      <p className="text-zinc-500 text-xs sm:text-sm font-mono">Dialing {ghostCode}</p>
                  </div>
              </div>
          )}

          {/* ======== Video Stages ======== */}
          {/* Remote Video (Full Screen) */}
          <div className={clsx(
              "absolute inset-0 transition-all duration-700",
              connectionState === 'connected' ? "opacity-100 scale-100" : "opacity-20 scale-95 blur-md"
          )}>
               <VideoStage 
                  stream={remoteStream} 
                  label="Remote" 
                  className="w-full h-full rounded-none!" 
               />
          </div>

          {/* Local Video (Floating) - repositioned for mobile */}
          <div className={clsx(
              "absolute z-20 transition-all shadow-2xl rounded-xl overflow-hidden border-2 border-white/20",
              // Mobile: smaller, top-right to avoid controls
              // Desktop: bottom-right, larger
              "top-4 right-4 w-28 sm:w-40 md:w-48 aspect-video",
              "sm:top-auto sm:bottom-28 sm:right-6"
          )}>
               <VideoStage 
                 stream={localStream} 
                 label="" 
                 isLocal 
                 isMuted 
                 className="w-full h-full"
               />
          </div>
       </main>

       {/* ======== Footer Controls - Mobile Optimized ======== */}
       <footer className="absolute bottom-0 left-0 right-0 z-30 pb-safe flex items-center justify-center gap-3 sm:gap-4 py-4 sm:py-6 bg-linear-to-t from-black/80 to-transparent">
            <button 
              onClick={handleToggleAudio}
              className={clsx(
                "w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all active:scale-90",
                isAudioMuted ? "bg-red-500/20 text-red-400 border border-red-500/50" : "bg-zinc-800/80 backdrop-blur border border-white/10"
              )}
              aria-label={isAudioMuted ? "Unmute microphone" : "Mute microphone"}
            >
                <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            
            <Link href="/">
              <button 
                 onClick={endCall}
                 className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-500 flex items-center justify-center text-white active:scale-90 transition-transform shadow-lg shadow-red-500/30"
                 aria-label="End call"
              >
                 <PhoneOff className="w-6 h-6 sm:w-8 sm:h-8" />
             </button>
            </Link>

            <button 
              onClick={handleToggleVideo}
              className={clsx(
                "w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all active:scale-90",
                isVideoOff ? "bg-red-500/20 text-red-400 border border-red-500/50" : "bg-zinc-800/80 backdrop-blur border border-white/10"
              )}
              aria-label={isVideoOff ? "Turn on camera" : "Turn off camera"}
            >
                <Video className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Screen Share Button */}
            <button 
              onClick={isScreenSharing ? stopScreenShare : startScreenShare}
              className={clsx(
                "w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all active:scale-90",
                isScreenSharing ? "bg-blue-500/20 text-blue-400 border border-blue-500/50" : "bg-zinc-800/80 backdrop-blur border border-white/10"
              )}
              aria-label={isScreenSharing ? "Stop screen share" : "Share screen"}
            >
                <Monitor className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
       </footer>
    </div>
  );
}
