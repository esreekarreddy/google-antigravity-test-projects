'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-2 md:p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl backdrop-blur-sm transition-all"
        aria-label="Menu"
      >
        {isOpen ? (
          <X className="w-5 h-5 md:w-6 md:h-6 text-white" />
        ) : (
          <Menu className="w-5 h-5 md:w-6 md:h-6 text-white" />
        )}
      </button>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-full max-w-sm md:w-80 bg-gradient-to-br from-slate-900 to-slate-950 border-l border-white/10 z-50 p-6 md:p-8"
            >
              <div className="flex flex-col gap-6 mt-20">
                
                <Link
                  href="/privacy"
                  onClick={() => setIsOpen(false)}
                  className="text-lg text-slate-300 hover:text-primary transition-colors"
                >
                  🔒 Privacy Policy
                </Link>
                
                <Link
                  href="/terms"
                  onClick={() => setIsOpen(false)}
                  className="text-lg text-slate-300 hover:text-primary transition-colors"
                >
                  📜 Terms of Service
                </Link>

                <div className="border-t border-white/10 pt-6 mt-6">
                  <p className="text-sm text-slate-500 mb-3">Contact & Source</p>
                  <a
                    href="https://github.com/esreekarreddy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline block mb-2"
                  >
                    GitHub: @esreekarreddy
                  </a>
                  <a
                    href="https://linkedin.com/in/esreekarreddy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline block"
                  >
                    LinkedIn: @esreekarreddy
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
