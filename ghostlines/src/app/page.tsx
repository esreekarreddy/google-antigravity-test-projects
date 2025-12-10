"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateGhostCode } from '@/lib/crypto';
import { Shield, Radio, Hash, X } from 'lucide-react';
import { GhostToaster, useToast } from '@/components/GhostToast';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dialPadOpen, setDialPadOpen] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const { addToast } = useToast();

  // ====== HOST: Broadcast a signal ======
  const broadcastSignal = () => {
    setLoading(true);
    const code = generateGhostCode();
    addToast('info', `Broadcasting as ${code}...`);
    router.push(`/call/ghost-${code}`);
  };

  return (
    <main className="min-h-dvh bg-black text-white flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      <GhostToaster />
      
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-zinc-900 via-black to-black pointer-events-none" />
      
      <div className="z-10 max-w-md w-full text-center space-y-6 sm:space-y-10">
        
        {/* Branding */}
        <div className="relative inline-block">
            <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 rounded-full animate-pulse" />
            <Shield className="w-16 h-16 sm:w-24 sm:h-24 text-white mx-auto relative z-10" strokeWidth={1.5} />
        </div>

        <div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white to-zinc-500">
            GhostLine.
          </h1>
          
          <p className="text-base sm:text-lg text-zinc-500 max-w-sm mx-auto mt-4">
            Zero-Server. End-to-End Encrypted. <br/>
            <span className="text-white font-medium">4-Digit Ephemeral Codes.</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Broadcast */}
            <button
              onClick={broadcastSignal}
              disabled={loading}
              className="group flex flex-col items-center justify-center p-4 sm:p-6 bg-emerald-900/30 border border-emerald-500/30 rounded-2xl hover:bg-emerald-900/50 transition-all active:scale-95 disabled:opacity-50"
            >
              <Radio className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400 mb-2 sm:mb-3 group-hover:animate-pulse" />
              <span className="font-bold text-base sm:text-lg">Broadcast</span>
              <span className="text-[10px] sm:text-xs text-zinc-500 mt-1">Start Hosting</span>
            </button>

            {/* Connect */}
            <button
              onClick={() => setDialPadOpen(true)}
              className="group flex flex-col items-center justify-center p-4 sm:p-6 bg-zinc-900/50 border border-zinc-700 rounded-2xl hover:bg-zinc-800 transition-all active:scale-95"
            >
              <Hash className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400 mb-2 sm:mb-3" />
              <span className="font-bold text-base sm:text-lg">Connect</span>
              <span className="text-[10px] sm:text-xs text-zinc-500 mt-1">Enter Code</span>
            </button>
        </div>

      </div>
      
      {/* ====== Code Input Modal (Keyboard Entry) ====== */}
      {dialPadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in p-4">
            <div className="bg-zinc-900 border border-zinc-700 p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-xs relative">
                {/* Close */}
                <button 
                  onClick={() => { setDialPadOpen(false); setCodeInput(''); }} 
                  className="absolute top-4 right-4 text-zinc-500 hover:text-white active:scale-90 transition-transform"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">Enter Code</h2>
                
                {/* Simple Text Input */}
                <input
                    type="text"
                    inputMode="text"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    maxLength={4}
                    autoFocus
                    placeholder="A1B2"
                    value={codeInput}
                    onChange={(e) => {
                        const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                        setCodeInput(val);
                        if (val.length === 4) {
                            setTimeout(() => {
                                addToast('info', `Connecting to ${val}...`);
                                router.push(`/call/ghost-${val}?join=true`);
                            }, 300);
                        }
                    }}
                    className="w-full text-center text-3xl sm:text-4xl font-mono font-bold tracking-[0.3em] sm:tracking-[0.5em] bg-black border-2 border-zinc-700 focus:border-emerald-500 rounded-xl py-3 sm:py-4 outline-none transition-colors uppercase"
                />
                
                <p className="text-[10px] sm:text-xs text-zinc-500 text-center mt-3 sm:mt-4">Type the 4-character code</p>
            </div>
        </div>
      )}
      
      {/* Footer Links */}
      <footer className="absolute bottom-4 sm:bottom-6 z-10 flex gap-4 sm:gap-6 text-[10px] sm:text-xs text-zinc-600 font-mono tracking-wide uppercase">
          <Link href="/privacy" className="hover:text-zinc-400 active:text-white transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-zinc-400 active:text-white transition-colors">Terms</Link>
          <a href="https://github.com/esreekarreddy/google-antigravity-test-projects/tree/main/ghostlines" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 active:text-white transition-colors">GitHub</a>
      </footer>
    </main>
  );
}
