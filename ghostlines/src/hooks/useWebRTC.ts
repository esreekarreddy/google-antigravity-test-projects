"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import Peer, { MediaConnection } from 'peerjs';

export type ConnectionState = 'idle' | 'connecting' | 'connected' | 'failed';

export interface UseWebRTCResult {
  peerId: string | null;
  remotePeerId: string | null;
  connectionState: ConnectionState;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  error: string | null;
  incomingCall: MediaConnection | null;
  answerIncomingCall: () => void;
  rejectIncomingCall: () => void;
  startCall: (remotePeerId: string) => void;
  endCall: () => void;
  toggleAudio: () => void;
  toggleVideo: () => void;
  startScreenShare: () => Promise<void>;
  stopScreenShare: () => void;
  isScreenSharing: boolean;
}

/**
 * WebRTC Hook - Manages P2P video calling via PeerJS
 * 
 * CRITICAL: This hook should only initialize the Peer ONCE per roomId.
 * Do NOT add any reactive state to the dependency array that could cause re-initialization.
 */
export function useWebRTC(roomId: string): UseWebRTCResult {
  // State
  const [peerId, setPeerId] = useState<string | null>(null);
  const [remotePeerId, setRemotePeerId] = useState<string | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [incomingCall, setIncomingCall] = useState<MediaConnection | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  // Refs for stable references (don't trigger re-renders)
  const peerRef = useRef<Peer | null>(null);
  const callRef = useRef<MediaConnection | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const isInitialized = useRef<boolean>(false);

  // ========== PEER INITIALIZATION (ONCE ONLY) ==========
  useEffect(() => {
    // Guard: Don't initialize if no roomId or already initialized
    if (!roomId || isInitialized.current) {
      return;
    }

    console.log(`[WebRTC] Initializing peer with ID: ${roomId}`);
    isInitialized.current = true;

    const peer = new Peer(roomId, {
      debug: 2,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' }
        ]
      }
    });

    peer.on('open', (id) => {
      console.log(`[WebRTC] Peer connected with ID: ${id}`);
      setPeerId(id);
      setConnectionState('idle');
    });

    peer.on('error', (err) => {
      console.error('[WebRTC] Peer error:', err);
      setError(err.message);
      setConnectionState('failed');
    });

    // Handle incoming calls
    peer.on('call', (call: MediaConnection) => {
      console.log(`[WebRTC] Incoming call from: ${call.peer}`);
      setIncomingCall(call);
    });

    peerRef.current = peer;

    // Cleanup on unmount ONLY (not on roomId change)
    return () => {
      console.log('[WebRTC] Cleaning up peer connection');
      peer.destroy();
      isInitialized.current = false;
    };
  }, [roomId]); // ONLY roomId - no other dependencies!

  // ========== ANSWER INCOMING CALL ==========
  const answerIncomingCall = useCallback(async () => {
    if (!incomingCall) {
      console.warn('[WebRTC] No incoming call to answer');
      return;
    }

    console.log('[WebRTC] Answering incoming call...');
    setConnectionState('connecting');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      setLocalStream(stream);
      
      incomingCall.answer(stream);
      
      incomingCall.on('stream', (remoteStream: MediaStream) => {
        console.log('[WebRTC] Received remote stream');
        setRemoteStream(remoteStream);
        setRemotePeerId(incomingCall.peer); // Save remote peer ID for security code
        setConnectionState('connected');
      });

      incomingCall.on('close', () => {
        console.log('[WebRTC] Call closed');
        setConnectionState('idle');
        setRemoteStream(null);
        setRemotePeerId(null);
      });

      callRef.current = incomingCall;
      setIncomingCall(null);
    } catch (err) {
      console.error('[WebRTC] Failed to answer call:', err);
      setError('Could not access camera/mic');
      setConnectionState('failed');
    }
  }, [incomingCall]);

  // ========== REJECT INCOMING CALL ==========
  const rejectIncomingCall = useCallback(() => {
    if (incomingCall) {
      console.log('[WebRTC] Rejecting incoming call');
      incomingCall.close();
      setIncomingCall(null);
    }
  }, [incomingCall]);

  // ========== START OUTGOING CALL ==========
  const startCall = useCallback(async (remotePeerId: string) => {
    if (!peerRef.current) {
      console.error('[WebRTC] Peer not initialized');
      return;
    }

    console.log(`[WebRTC] Starting call to: ${remotePeerId}`);
    setConnectionState('connecting');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      setLocalStream(stream);

      const call = peerRef.current.call(remotePeerId, stream);
      
      call.on('stream', (remoteStream: MediaStream) => {
        console.log('[WebRTC] Received remote stream');
        setRemoteStream(remoteStream);
        setRemotePeerId(remotePeerId); // We know who we're calling
        setConnectionState('connected');
      });

      call.on('error', (err: Error) => {
        console.error('[WebRTC] Call error:', err);
        setConnectionState('failed');
      });

      call.on('close', () => {
        console.log('[WebRTC] Call closed');
        setConnectionState('idle');
        setRemoteStream(null);
        setRemotePeerId(null);
      });

      callRef.current = call;
    } catch (err) {
      console.error('[WebRTC] Failed to start call:', err);
      setError('Could not access camera/mic');
      setConnectionState('failed');
    }
  }, []);

  // ========== END CALL ==========
  const endCall = useCallback(() => {
    console.log('[WebRTC] Ending call');
    
    if (callRef.current) {
      callRef.current.close();
      callRef.current = null;
    }
    
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    setRemoteStream(null);
    setConnectionState('idle');
    setIncomingCall(null);
  }, [localStream]);

  // ========== TOGGLE AUDIO ==========
  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        console.log(`[WebRTC] Audio ${audioTrack.enabled ? 'enabled' : 'disabled'}`);
      }
    }
  }, [localStream]);

  // ========== TOGGLE VIDEO ==========
  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        console.log(`[WebRTC] Video ${videoTrack.enabled ? 'enabled' : 'disabled'}`);
      }
    }
  }, [localStream]);

  // ========== SCREEN SHARING ==========
  const startScreenShare = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      screenStreamRef.current = screenStream;
      setIsScreenSharing(true);
      
      // Replace video track in the call
      if (callRef.current && localStream) {
        const videoTrack = screenStream.getVideoTracks()[0];
        const sender = callRef.current.peerConnection?.getSenders().find(s => s.track?.kind === 'video');
        if (sender && videoTrack) {
          sender.replaceTrack(videoTrack);
        }
        
        // When screen share ends, revert to camera
        videoTrack.onended = async () => {
          // Stop screen share inline to avoid forward reference
          if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach(t => t.stop());
            screenStreamRef.current = null;
          }
          setIsScreenSharing(false);
          
          if (callRef.current && localStream) {
            const cameraTrack = localStream.getVideoTracks()[0];
            const snd = callRef.current.peerConnection?.getSenders().find(s => s.track?.kind === 'video');
            if (snd && cameraTrack) {
              snd.replaceTrack(cameraTrack);
            }
          }
        };
      }
    } catch (err) {
      console.error('[WebRTC] Screen share failed:', err);
    }
  }, [localStream]);

  const stopScreenShare = useCallback(async () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(t => t.stop());
      screenStreamRef.current = null;
    }
    setIsScreenSharing(false);
    
    // Revert to camera
    if (callRef.current && localStream) {
      const cameraTrack = localStream.getVideoTracks()[0];
      const sender = callRef.current.peerConnection?.getSenders().find(s => s.track?.kind === 'video');
      if (sender && cameraTrack) {
        sender.replaceTrack(cameraTrack);
      }
    }
  }, [localStream]);

  return {
    peerId,
    remotePeerId,
    connectionState,
    localStream,
    remoteStream,
    error,
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
  };
}
