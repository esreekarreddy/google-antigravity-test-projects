"use client"

import { motion } from 'framer-motion'
import { HamburgerMenu } from '@/components/layout/hamburger-menu'
import { WarpDropzone } from '@/components/transfer/warp-dropzone'
import { ConnectionManager } from '@/components/transfer/connection-manager'
import { TransferStatus } from '@/components/transfer/transfer-status'
import { Toaster } from 'sonner'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 py-12 md:py-16 relative z-10 w-full max-w-full">
      <HamburgerMenu />
      <Toaster position="top-center" />
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 md:mb-12 px-4 w-full max-w-4xl"
      >
        <div className="inline-block mb-4 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_30px_-5px_var(--primary)]">
          <svg className="w-8 h-8 md:w-10 md:h-10" viewBox="0 0 512 512" fill="none">
            <path d="M256 32L32 128V384L256 480L480 384V128L256 32Z" stroke="#00f0ff" strokeWidth="20" fill="rgba(0, 240, 255, 0.2)" />
            <circle cx="256" cy="256" r="80" stroke="#ff0055" strokeWidth="15" />
          </svg>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-transparent bg-clip-text bg-linear-to-br from-white via-white to-white/50 mb-3 md:mb-4 tracking-tight px-2">
          ZapShare
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-md md:max-w-lg mx-auto leading-relaxed px-4">
          Secure, peer-to-peer file transfer at <span className="text-primary font-bold">lightspeed</span>.
          <br className="hidden sm:block" /><span className="sm:hidden"> </span>No cloud storage. No file limits.
        </p>
      </motion.div>

      {/* Main Interface */}
      <div className="w-full max-w-2xl relative px-4 md:px-0">
        {/* Glow Effects */}
        <div className="absolute -inset-10 bg-linear-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-[3rem] blur-3xl z-[-1] opacity-50 animate-pulse-slow" />
        
        <WarpDropzone />
        
        <div className="relative z-10">
          <ConnectionManager />
          <TransferStatus />
        </div>
      </div>
    </div>
  )
}
