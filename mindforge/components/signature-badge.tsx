"use client"

import { useStore } from "@/store/use-store"
import { cn } from "@/lib/utils"
import { useMounted } from "@/hooks/use-mounted"

export function SignatureBadge() {
  const { view } = useStore()
  const mounted = useMounted()

  if (!mounted) return null

  const isMindMap = view === "mindmap"

  return (
    <a
      href="https://github.com/esreekarreddy/google-antigravity-test-projects"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "fixed z-50 flex items-center justify-center px-2 py-1 rounded-md bg-white/50 backdrop-blur-sm border border-slate-200/50 shadow-sm hover:shadow-md hover:bg-white hover:scale-105 transition-all duration-300 group",
        isMindMap ? "top-4 right-4" : "bottom-4 right-4",
      )}
    >
      <span className="text-[10px] font-bold tracking-widest text-slate-400 group-hover:text-slate-800 transition-colors">
        [SR]
      </span>
    </a>
  )
}
