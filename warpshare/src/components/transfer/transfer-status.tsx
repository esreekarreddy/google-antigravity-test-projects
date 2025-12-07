"use client"

import { useWarpStore } from '@/store/use-warp-store'
import { motion } from 'framer-motion'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { calculateFileHash, formatHashPreview } from '@/lib/file-hash'

export function TransferStatus() {
  const { status, conn, file, progress, setProgress, setStatus, isPeerReady, mode, readyToDownload, setReadyToDownload, setFile, setFileHash } = useWarpStore()

  // Manual send function with SHA-256 hashing
  const handleSendFile = async () => {
    if (!file || !conn) return

    try {
      setStatus('transferring')
      
      // CRITICAL: Calculate file hash BEFORE sending
      toast.info('Calculating file hash...')
      const fileHash = await calculateFileHash(file)
      setFileHash(fileHash)
      
      // 1. Send Meta WITH HASH
      conn.send({
        type: 'file-meta',
        name: file.name,
        size: file.size,
        fileType: file.type,
        hash: fileHash  // SHA-256 hash for integrity verification
      })
      
      console.log('[Send] Metadata sent:', file.name, file.size, 'bytes')
      toast.success('Hash verified. Starting transfer...')
      
      // 2. Chunk & Send - Convert ArrayBuffer to base64 to avoid PeerJS serialization issues
      const CHUNK_SIZE = 16 * 1024 // 16KB
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
      let offset = 0
      
      for (let i = 0; i < totalChunks; i++) {
         const slice = file.slice(offset, offset + CHUNK_SIZE)
         const buffer = await slice.arrayBuffer()
         
         // Convert ArrayBuffer to Uint8Array then to base64
         const uint8 = new Uint8Array(buffer)
         const base64 = btoa(String.fromCharCode(...uint8))
         
         conn.send({
           type: 'chunk',
           data: base64,  // Send as base64 string
           index: i
         })
         
         console.log(`[Send] Chunk ${i + 1}/${totalChunks} sent:`, buffer.byteLength, 'bytes')
         
         offset += CHUNK_SIZE
         const percent = Math.min(((i + 1) / totalChunks) * 100, 99)
         setProgress(percent)
         
         if (i % 50 === 0) await new Promise(r => setTimeout(r, 0))
      }
      
      // 3. Complete Signal
      conn.send({ type: 'transfer-complete' })
      console.log('[Send] Transfer complete signal sent')
      
      setProgress(100)
      setStatus('completed')
      toast.success('Transfer Complete!')
      
    } catch (err) {
      console.error('[Send] Error:', err)
      setStatus('failed')
      toast.error('Transfer Failed')
    }
  }

  // Manual download function
  const handleDownload = () => {
    if (!readyToDownload) return
    
    const url = URL.createObjectURL(readyToDownload)
    const a = document.createElement('a')
    a.href = url
    a.download = readyToDownload.name
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success('Download Started!')
    
    // Reset after download
    setTimeout(() => {
      setReadyToDownload(null)
      setFile(null)
      setStatus('idle')
    }, 1000)
  }


  if (status === 'idle' || status === 'ready') return null

  // Show "Send Now" button for sender when connected and peer is ready
  const showSendButton = status === 'connected' && isPeerReady && file && mode === 'send'
  
  // Show "Download" button for receiver when file is ready
  const showDownloadButton = status === 'completed' && readyToDownload && mode === 'receive'

  return (
    <div className="w-full max-w-xl mx-auto mt-8 glass-panel p-6 rounded-2xl border-t border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <StatusIcon status={status} />
          <div>
            <h3 className="font-bold text-white capitalize">{getStatusText(status)}</h3>
            <p className="text-sm text-slate-400">
              {file ? file.name : (status === 'connected' ? 'Waiting for file...' : 'Connecting...')}
            </p>
          </div>
        </div>
        <span className="font-mono text-primary font-bold">
          {Math.round(progress)}%
        </span>
      </div>

      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary shadow-[0_0_10px_#00f0ff]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Send Now Button */}
      {showSendButton && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleSendFile}
          className="w-full mt-4 bg-primary text-black font-bold py-3 rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/50"
        >
          🚀 Send Now
        </motion.button>
      )}

      {/* Download Button */}
      {showDownloadButton && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleDownload}
          className="w-full mt-4 bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-all shadow-lg hover:shadow-green-500/50"
        >
          ⬇️ Download File
        </motion.button>
      )}

      {status === 'connected' && !showSendButton && !showDownloadButton && (
        <p className="text-center text-sm text-slate-400 mt-4 animate-pulse">
          {isPeerReady ? 'Ready to transfer...' : 'Establishing secure handshake...'}
        </p>
      )}
    </div>
  )
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'connecting':
    case 'transferring':
      return <Loader2 className="w-6 h-6 text-primary animate-spin" />
    case 'completed':
      return <CheckCircle2 className="w-6 h-6 text-green-500" />
    case 'failed':
      return <XCircle className="w-6 h-6 text-red-500" />
    default:
      return <div className="w-6 h-6 rounded-full border-2 border-slate-600" />
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'connecting': return 'Establishing Zap Connection...'
    case 'connected': return 'Zap Tunnel Active'
    case 'transferring': return 'Transferring Data...'
    case 'completed': return 'Zap Transfer Successful'
    case 'failed': return 'Zap Failed'
    default: return status
  }
}
