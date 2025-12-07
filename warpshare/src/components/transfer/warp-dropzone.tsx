"use client"

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, File, X } from 'lucide-react'
import { useWarpStore } from '@/store/use-warp-store'
import { cn } from '@/lib/utils'

export function WarpDropzone() {
  const { file, setFile, setMode, status } = useWarpStore()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
      setMode('send')
    }
  }, [setFile, setMode])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    multiple: false,
    disabled: status !== 'idle' && status !== 'ready'
  })

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation()
    setFile(null)
    setMode(null)
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            <div
              {...getRootProps()}
              className={cn(
                "relative group cursor-pointer overflow-hidden rounded-2xl glass-panel p-12 text-center transition-all duration-300",
                isDragActive ? "border-primary bg-primary/10" : "hover:border-primary/50 hover:bg-white/5"
              )}
            >
            <input {...getInputProps()} />
            
            {/* Animated Ring */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-2xl transition-all duration-500" />
            
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className={cn(
                "p-4 rounded-full bg-white/5 transition-all duration-300",
                isDragActive ? "bg-primary/20 scale-110" : "group-hover:scale-110"
              )}>
                <Upload className={cn(
                  "w-8 h-8 text-slate-400 transition-colors duration-300",
                  isDragActive ? "text-primary" : "group-hover:text-primary"
                )} />
              </div>
              
              <div>
                <h3 className="text-xl font-display font-bold text-white mb-2">
                  {isDragActive ? "Drop to Warp" : "Initiate Warp Transfer"}
                </h3>
                <p className="text-slate-400">
                  Drag & drop any file, or click to browse
                </p>
              </div>
            </div>
            
            {/* Grid Background Effect */}
            <div className="absolute inset-0 z-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="file-preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative glass-panel rounded-2xl p-6 flex items-center gap-4 border-primary/30 bg-primary/5"
          >
            <div className="p-3 rounded-xl bg-primary/20">
              <File className="w-8 h-8 text-primary" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-white truncate">{file.name}</h4>
              <p className="text-sm text-primary/80">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>

            {status === 'idle' && (
              <button
                onClick={clearFile}
                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
