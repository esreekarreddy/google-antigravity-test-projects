"use client"

import { useStore, type KanbanStatus } from "@/store/use-store"
import { KanbanColumn } from "./kanban-column"
import { motion } from "framer-motion"

const columns: { id: KanbanStatus; title: string; color: string }[] = [
  { id: "todo", title: "To Do", color: "bg-blue-500" },
  { id: "doing", title: "In Progress", color: "bg-amber-500" },
  { id: "done", title: "Done", color: "bg-emerald-500" },
]

export function KanbanBoard() {
  const { nodes } = useStore()

  const kanbanNodes = Object.values(nodes).filter((n) => n.kanbanStatus)

  return (
    <div className="h-full w-full overflow-x-auto p-6 bg-gradient-to-br from-slate-50 to-slate-100">
      <motion.div
        className="flex gap-6 h-full min-w-max"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            color={column.color}
            cards={kanbanNodes.filter((n) => n.kanbanStatus === column.id)}
          />
        ))}
      </motion.div>

      {kanbanNodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-slate-500">
            <p className="text-lg font-medium">No Kanban cards yet</p>
            <p className="text-sm mt-1">Use the "Add card" button in any column, or convert nodes from the mindmap</p>
          </div>
        </div>
      )}
    </div>
  )
}
