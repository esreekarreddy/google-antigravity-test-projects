"use client"

import type React from "react"
import { useStore, type MindmapNode } from "@/store/use-store"
import { cn } from "@/lib/utils"
import { FileText, Trash2, MoreHorizontal } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface KanbanCardProps {
  node: MindmapNode
}

export function KanbanCard({ node }: KanbanCardProps) {
  const { setSelectedNode, setView, selectedNodeId, deleteNode, updateNode } = useStore()

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("nodeId", node.id)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleClick = () => {
    setSelectedNode(node.id)
  }

  const handleOpenNotes = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedNode(node.id)
    setView("notes")
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteNode(node.id)
  }

  const handleRemoveFromKanban = (e: React.MouseEvent) => {
    e.stopPropagation()
    updateNode(node.id, { kanbanStatus: undefined })
  }

  const hasNotes = node.notes.trim().length > 0

  const getStatusStyles = () => {
    switch (node.kanbanStatus) {
      case "todo":
        return "bg-white border-l-4 border-l-blue-500 hover:shadow-blue-100"
      case "doing":
        return "bg-white border-l-4 border-l-amber-500 hover:shadow-amber-100"
      case "done":
        return "bg-white border-l-4 border-l-emerald-500 hover:shadow-emerald-100"
      default:
        return "bg-white border-l-4 border-l-slate-300"
    }
  }

  return (
    <motion.div
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
      className={cn(
        "group relative p-4 rounded-lg border border-slate-200 cursor-pointer transition-all hover:shadow-md",
        getStatusStyles(),
        selectedNodeId === node.id && "ring-2 ring-blue-500",
      )}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Card content */}
      <h4 className="font-medium text-slate-800 pr-8">{node.title}</h4>

      {hasNotes && (
        <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
          <FileText className="h-3.5 w-3.5" />
          <span>Has notes</span>
        </div>
      )}

      {/* Actions dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleOpenNotes}>
            <FileText className="mr-2 h-4 w-4" />
            Open Notes
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleRemoveFromKanban}>Remove from Kanban</DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  )
}
