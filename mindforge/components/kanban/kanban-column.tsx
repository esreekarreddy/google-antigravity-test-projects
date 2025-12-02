"use client"

import type React from "react"
import { useStore, type KanbanStatus, type MindmapNode } from "@/store/use-store"
import { KanbanCard } from "./kanban-card"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface KanbanColumnProps {
  id: KanbanStatus
  title: string
  color: string
  cards: MindmapNode[]
}

export function KanbanColumn({ id, title, color, cards }: KanbanColumnProps) {
  const { setKanbanStatus, createNode, updateNode, convertToKanban } = useStore()
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const nodeId = e.dataTransfer.getData("nodeId")
    if (nodeId) {
      setKanbanStatus(nodeId, id)
    }
  }

  const handleAddCard = () => {
    const newId = createNode()
    updateNode(newId, { title: "New Task" })
    convertToKanban(newId)
    setKanbanStatus(newId, id)
  }

  const getHeaderColor = () => {
    switch (id) {
      case "todo":
        return "bg-blue-500"
      case "doing":
        return "bg-amber-500"
      case "done":
        return "bg-emerald-500"
      default:
        return "bg-slate-500"
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col w-80 rounded-xl bg-slate-50 border border-slate-200 transition-all overflow-hidden",
        isDragOver && "ring-2 ring-blue-500 border-blue-300 bg-blue-50/50",
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column header */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-200 bg-white">
        <div className={cn("h-3 w-3 rounded-full", getHeaderColor())} />
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <span className="ml-auto text-sm text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
          {cards.length}
        </span>
      </div>

      {/* Cards container */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto min-h-[300px]">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <KanbanCard node={card} />
          </motion.div>
        ))}

        {/* Add card button */}
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-500 hover:text-slate-700 hover:bg-slate-100 border border-dashed border-slate-300"
          onClick={handleAddCard}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add card
        </Button>
      </div>
    </div>
  )
}
