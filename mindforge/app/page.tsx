"use client"

import { useStore } from "@/store/use-store"
import { Sidebar } from "@/components/sidebar"
import { MindmapCanvas } from "@/components/mindmap/mindmap-canvas"
import { KanbanBoard } from "@/components/kanban/kanban-board"
import { NotesEditor } from "@/components/notes/notes-editor"
import { KeyboardHandler } from "@/components/keyboard-handler"
import { AnimatePresence, motion } from "framer-motion"
import { useMounted } from "@/hooks/use-mounted"

export default function Home() {
  const { view } = useStore()
  const mounted = useMounted()

  if (!mounted) return null

  return (
    <div className="h-screen w-screen overflow-hidden">
      <KeyboardHandler />
      <Sidebar />

      <main className="ml-16 h-full">
        <AnimatePresence mode="wait">
          {view === "mindmap" && (
            <motion.div
              key="mindmap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <MindmapCanvas />
            </motion.div>
          )}

          {view === "kanban" && (
            <motion.div
              key="kanban"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <KanbanBoard />
            </motion.div>
          )}

          {view === "notes" && (
            <motion.div
              key="notes"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <NotesEditor />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
