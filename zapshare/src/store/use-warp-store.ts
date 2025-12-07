import { create } from 'zustand'
import type { DataConnection, Peer } from 'peerjs'

export type TransferStatus = 'idle' | 'generating' | 'ready' | 'connecting' | 'connected' | 'transferring' | 'completed' | 'failed'
export type Mode = 'send' | 'receive' | null

interface WarpState {
  myId: string | null
  peer: Peer | null
  conn: DataConnection | null
  status: TransferStatus
  mode: Mode
  file: File | null
  progress: number
  error: string | null
  isPeerReady: boolean
  readyToDownload: File | null  // Stores the completed file blob for manual download
  fileHash: string | null  // SHA-256 hash of sent/received file
  codeExpiry: number | null  // Unix timestamp when code expires

  setMyId: (id: string) => void
  setPeer: (peer: Peer | null) => void
  setConn: (conn: DataConnection) => void
  setStatus: (status: TransferStatus) => void
  setMode: (mode: Mode) => void
  setFile: (file: File | null) => void
  setProgress: (progress: number | ((prev: number) => number)) => void
  setError: (error: string | null) => void
  setIsPeerReady: (ready: boolean) => void
  setReadyToDownload: (file: File | null) => void
  setFileHash: (hash: string | null) => void
  setCodeExpiry: (expiry: number | null) => void
  reset: () => void
}

export const useWarpStore = create<WarpState>((set) => ({
  myId: null,
  peer: null,
  conn: null,
  status: 'idle',
  mode: null,
  file: null,
  progress: 0,
  error: null,
  isPeerReady: false,
  readyToDownload: null,
  fileHash: null,
  codeExpiry: null,

  setMyId: (id) => set({ myId: id }),
  setPeer: (peer) => set({ peer }),
  setConn: (conn) => set({ conn }),
  setStatus: (status) => set({ status }),
  setMode: (mode) => set({ mode }),
  setFile: (file) => set({ file }),
  setProgress: (progress) => set((state) => ({ 
    progress: typeof progress === 'function' ? progress(state.progress) : progress 
  })),
  setIsPeerReady: (isPeerReady) => set({ isPeerReady }),
  setReadyToDownload: (file) => set({ readyToDownload: file }),
  setFileHash: (hash) => set({ fileHash: hash }),
  setCodeExpiry: (expiry) => set({ codeExpiry: expiry }),
  setError: (error) => set({ error }),
  reset: () => set({ 
    conn: null, 
    status: 'idle', 
    mode: null, 
    file: null, 
    progress: 0, 
    error: null,
    isPeerReady: false,
    readyToDownload: null,
    fileHash: null
    // We keep 'peer', 'myId', and 'codeExpiry' to avoid reconnecting
  })
}))
