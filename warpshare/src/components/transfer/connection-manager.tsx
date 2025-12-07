"use client"

import { useEffect, useState, useCallback } from 'react'
import Peer, { type DataConnection } from 'peerjs'
import { motion } from 'framer-motion'
import { Copy, ArrowRight, Loader2, Check, Clock, RefreshCw } from 'lucide-react'
import { useWarpStore } from '@/store/use-warp-store'
import { toast } from 'sonner'
import { generateSecureCode, codeToPeerId } from '@/lib/code-generator'
import { calculateFileHash, formatHashPreview } from '@/lib/file-hash'

// Type for file metadata received over the connection
interface FileMetaData {
  type: 'file-meta'
  name: string
  size: number
  fileType: string
  hash: string  // SHA-256 hash of the file
}

// Type guard to check if data is FileMetaData
function isFileMetaData(data: unknown): data is FileMetaData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'type' in data &&
    (data as FileMetaData).type === 'file-meta'
  )
}

const CODE_EXPIRY_MS = 5 * 60 * 1000 // 5 minutes

export function ConnectionManager() {
  const { 
    setMyId, peer, setPeer, 
    setConn, setStatus, status, 
    mode, setMode, setFile, 
    setError, setProgress, setIsPeerReady, setReadyToDownload,
    codeExpiry, setCodeExpiry, setFileHash
  } = useWarpStore()

  const [inputCode, setInputCode] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const [generatedInfo, setGeneratedInfo] = useState<{displayCode: string, peerId: string} | null>(null)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  // Generate code and set expiry on mount
  useEffect(() => {
    if (!generatedInfo) {
      const displayCode = generateSecureCode()
      const peerId = codeToPeerId(displayCode)
      const expiry = Date.now() + CODE_EXPIRY_MS
      
      setGeneratedInfo({ displayCode, peerId })
      setCodeExpiry(expiry)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Countdown timer for code expiry
  useEffect(() => {
    if (!codeExpiry) return

    const interval = setInterval(() => {
      const remaining = codeExpiry - Date.now()
      if (remaining <= 0) {
        setTimeLeft(0)
        toast.error('Code expired! Generating new code...')
        // Generate new code
        const displayCode = generateSecureCode()
        const peerId = codeToPeerId(displayCode)
        const expiry = Date.now() + CODE_EXPIRY_MS
        setGeneratedInfo({ displayCode, peerId })
        setCodeExpiry(expiry)
      } else {
        setTimeLeft(Math.ceil(remaining / 1000)) // seconds
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [codeExpiry, setCodeExpiry])

  const displayCode = generatedInfo?.displayCode || ''
  const peerId = generatedInfo?.peerId

  // ... (Chunking constants and Data Handler remain same) ...

  // Centralized Data Handler
  const [receivedChunks, setReceivedChunks] = useState<Array<{index: number, blob: Blob}>>([])
  const [receivedSize, setReceivedSize] = useState(0)
  const [meta, setMeta] = useState<FileMetaData | null>(null)

  const handleReceiveData = useCallback((data: unknown) => {
    // 1. Handle Meta (now includes hash)
    if (isFileMetaData(data)) {
      console.log('[Receive] Got metadata:', data.name, data.size, 'bytes')
      setMeta(data)
      setReceivedChunks([])
      setReceivedSize(0)
      
      setMode('receive')
      setFile({ name: data.name, size: data.size, type: data.fileType } as File)
      setFileHash(data.hash) // Store expected hash
      setProgress(0)
      setStatus('transferring')
      
      toast.info(`Receiving: ${data.name}\nHash: ${formatHashPreview(data.hash)}`)
    }
    // 2. Handle Chunk
    else if (
        data && 
        typeof data === 'object' && 
        'type' in data && 
        (data as Record<string, unknown>).type === 'chunk'
    ) {
      const chunkData = (data as Record<string, unknown>).data
      const chunkIndex = (data as Record<string, unknown>).index as number
      
      // Decode base64 string back to ArrayBuffer
      if (typeof chunkData === 'string') {
        try {
          const binaryString = atob(chunkData)
          const bytes = new Uint8Array(binaryString.length)
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
          }
          
          const blob = new Blob([bytes])
          setReceivedChunks(prev => [...prev, { index: chunkIndex, blob }])
          setReceivedSize(prev => prev + bytes.byteLength)
        } catch (error) {
          console.error('[SR ZapShare] Chunk decode failed:', error)
        }
      } else {
        console.error('[SR ZapShare] Invalid chunk data type')
      }
    }
    // 3. Handle Completion Signal
    else if (
        data && 
        typeof data === 'object' && 
        'type' in data && 
        (data as Record<string, unknown>).type === 'transfer-complete'
    ) {
        console.log('[Receive] Transfer complete signal received')
        setStatus('completed')
    }
    // 4. Handle Handshake
    else if (
        data && 
        typeof data === 'object' && 
        'type' in data && 
        (data as Record<string, unknown>).type === 'ready'
    ) {
        console.log('[Receive] Peer is ready')
        setIsPeerReady(true)
    }
  }, [setMode, setFile, setProgress, setStatus, setIsPeerReady, setFileHash])

  // Effect to track receiver progress and prepare file for download WITH HASH VERIFICATION
  useEffect(() => {
    if (status === 'transferring' && meta && meta.size > 0) {
      const percent = (receivedSize / meta.size) * 100
      setProgress(percent)
    }
    
    // When transfer completes, VERIFY HASH then prepare file
    if (status === 'completed' && meta && receivedChunks.length > 0) {
      const verifyAndPrepare = async () => {
        try {
          // Sort chunks by index before reconstruction
          const sortedChunks = [...receivedChunks].sort((a, b) => a.index - b.index)
          
          const fullBlob = new Blob(sortedChunks.map(c => c.blob), { type: meta.fileType })
          const file = new File([fullBlob], meta.name, { type: meta.fileType })
          
          // Verify file hash
          toast.info('Verifying file integrity...')
          
          const calculatedHash = await calculateFileHash(file)
          
          if (calculatedHash !== meta.hash) {
            console.error('[SR ZapShare] Hash mismatch detected')
            toast.error('⚠️ File integrity check failed')
            toast.warning('File may be corrupted. Download with caution.')
            
            setReadyToDownload(file)
            setError('Hash verification failed')
          } else {
            console.log('[SR ZapShare] ✅ File verified')
            toast.success('✅ File verified!')
            setReadyToDownload(file)
          }
          
          // Cleanup
          setTimeout(() => {
            setMeta(null)
            setReceivedChunks([])
            setReceivedSize(0)
          }, 1000)
        } catch (error) {
          console.error('[SR ZapShare] Verification error:', error)
          toast.error('Verification failed')
          setStatus('failed')
        }
      }
      
      verifyAndPrepare()
    }
  }, [receivedSize, meta, status, receivedChunks, setProgress, setReadyToDownload, setStatus, setError])


  // Centralized Connection Handler
  const handleConnection = useCallback((conn: DataConnection) => {
    setConn(conn)
    setStatus('connected')
    toast.success('Warp Link Established!')

    // Handshake: Announce we are ready to receive data
    // Both sides do this, ensuring the pipe is open
    conn.send({ type: 'ready' })

    conn.on('data', (data) => {
      handleReceiveData(data)
    })
    
    conn.on('close', () => {
      setStatus('idle')
      toast.info('Connection Closed')
      setReceivedChunks([])
      setReceivedSize(0)
      setIsPeerReady(false)
    })
    
    conn.on('error', () => {
        setStatus('failed')
        toast.error("Connection Interrupted")
    })
  }, [setConn, setStatus, handleReceiveData, setIsPeerReady])
  
  // Clean up Peer on unmount
  useEffect(() => {
    // We generally want to keep the peer alive during the session
    // newPeer.destroy() 
  }, [])


  // Initialize Peer WITH RETRY LOGIC
  useEffect(() => {
    if (!peerId || peer) return

    console.log('[Peer] Attempting to create peer with ID:', peerId)
    let retryCount = 0
    const MAX_RETRIES = 1 // Only retry once to avoid spam
    
    const createPeer = () => {
      try {
        // Use default PeerJS configuration (no custom server)
        // This will use PeerJS's built-in server selection
        const newPeer = new Peer(peerId, {
          debug: 0,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:stun1.l.google.com:19302' },
              { urls: 'stun:stun2.l.google.com:19302' }
            ]
          }
        })

        // Longer timeout - 30 seconds
        const connectionTimeout = setTimeout(() => {
          if (!newPeer.id) {
            console.error('[Peer] Connection timeout after 30s')
            newPeer.destroy()
            
            if (retryCount < MAX_RETRIES) {
              retryCount++
              console.log(`[Peer] Retry attempt ${retryCount}/${MAX_RETRIES}`)
              setTimeout(createPeer, 3000)
            } else {
              // Only show error toast on final failure
              toast.error('Could not connect to network. Please refresh the page.')
            }
          }
        }, 30000) // 30 second timeout

        newPeer.on('open', (id) => {
          console.log('[Peer] Connected! ID:', id)
          clearTimeout(connectionTimeout)
          setMyId(id)
          setPeer(newPeer)
          // Silent success - no toast spam
        })

        newPeer.on('connection', (conn) => {
          console.log('[Peer] Incoming connection...')
          handleConnection(conn)
        })

        newPeer.on('error', (err) => {
          console.error('[Peer] Error:', err)
          clearTimeout(connectionTimeout)
          
          if (err.type === 'unavailable-id') {
            toast.error('Code already in use. Generating new code...')
            const newCode = generateSecureCode()
            const newPeerId = codeToPeerId(newCode)
            setGeneratedInfo({ displayCode: newCode, peerId: newPeerId })
          } else if (err.type === 'network') {
            // Don't show error toast immediately - let timeout handle it
            console.error('[Peer] Network error, will retry if needed')
          } else {
            // Only show error for non-network issues
            if (retryCount >= MAX_RETRIES) {
              toast.error('Connection error. Please refresh the page.')
            }
          }
          
          newPeer.destroy()
          
          if (retryCount < MAX_RETRIES && err.type === 'network') {
            retryCount++
            setTimeout(createPeer, 3000)
          }
        })

      } catch (error) {
        console.error('[Peer] Creation failed:', error)
        
        if (retryCount < MAX_RETRIES) {
          retryCount++
          setTimeout(createPeer, 3000)
        } else {
          toast.error('Failed to initialize. Please refresh the page.')
        }
      }
    }

    createPeer()
  }, [peerId, peer, handleConnection, setMyId, setPeer])


  const connect = (targetCode: string) => {
    if (!peer) {
      toast.error('Initializing connection... Please wait a moment.')
      return
    }
    setStatus('connecting')
    
    // Normalize code input to ID
    const targetId = `sr-warp-${targetCode.trim().toLowerCase()}`
    
    const conn = peer.connect(targetId)
    
    conn.on('open', () => {
        handleConnection(conn)
    })
    
    conn.on('error', () => {
      setStatus('failed')
      toast.error('Connection Failed')
    })
  }
  
  const copyCode = () => {
    navigator.clipboard.writeText(displayCode)
    setIsCopied(true)
    toast.success('Zap Code Copied!')
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-xl mx-auto mt-8 flex flex-col items-center gap-6">
      
      {/* Sender View */}
      {(mode === 'send' || mode === null) && status === 'idle' && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center"
        >
          <p className="text-slate-400 mb-2">Share this Zap Code with the receiver</p>
          <div className="flex items-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-xl pl-4">
            <span className="font-mono text-xl text-primary font-bold tracking-wide">
              {displayCode || 'Loading...'}
            </span>
            <button 
              onClick={copyCode}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Copy code"
            >
              {isCopied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-slate-400" />}
            </button>
            <button
              onClick={() => {
                const displayCode = generateSecureCode()
                const peerId = codeToPeerId(displayCode)
                const expiry = Date.now() + CODE_EXPIRY_MS
                setGeneratedInfo({ displayCode, peerId })
                setCodeExpiry(expiry)
                toast.success('New code generated!')
              }}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Generate new code"
            >
              <RefreshCw className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          {timeLeft !== null && timeLeft > 0 && (
            <div className="flex items-center justify-center gap-2 mt-2 text-xs text-slate-500">
              <Clock className="w-3 h-3" />
              <span>Expires in {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
            </div>
          )}
        </motion.div>
      )}

      {/* Receiver View Toggle */}
      {mode === null && (status === 'idle' || status === 'connecting') && (
        <>
          <div className="w-full h-px bg-white/10 my-2" />
          
          <div className="w-full glass-panel p-4 md:p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Receive a File</h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder={peer ? "Enter Zap Code (e.g. Cosmic-Falcon)" : "Initializing..."}
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors text-sm md:text-base"
                disabled={status === 'connecting'}
              />
              <button
                onClick={() => connect(inputCode)}
                disabled={!inputCode || status === 'connecting'}
                title={!peer ? 'Initializing connection...' : ''}
                className="bg-primary text-black font-bold px-6 py-3 rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {status === 'connecting' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Connect <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </div>
            {!peer && (
              <p className="text-xs text-slate-500 mt-2 animate-pulse">
                Initializing secure connection...
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
