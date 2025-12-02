"use client"

import type React from "react"
import { useStore, type MindmapNode } from "@/store/use-store"
import { cn } from "@/lib/utils"
import { FileText, Trash2, MoreHorizontal, CornerDownRight, Plus, Edit3 } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useState, useRef, useEffect } from "react"

interface KanbanCardProps {
  node: MindmapNode
}

export function KanbanCard({ node }: KanbanCardProps) {
  const { nodes, setSelectedNode, setView, selectedNodeId, deleteNode, updateNode, createNode } = useStore()
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const parentNode = node.parentId && node.parentId !== "root" ? nodes[node.parentId] : null

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleDragStart = (e: React.DragEvent) => {
    if (isEditing) {
      e.preventDefault()
      return
    }
    e.dataTransfer.setData("nodeId", node.id)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleClick = () => {
    if (!isEditing) {
      setSelectedNode(node.id)
    }
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
  }

  const handleTitleSubmit = () => {
    setIsEditing(false)
    if (inputRef.current && inputRef.current.value.trim() !== "") {
      updateNode(node.id, { title: inputRef.current.value })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleSubmit()
    } else if (e.key === "Escape") {
      setIsEditing(false)
    }
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

  const handleAddSubtask = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newId = createNode(node.id)
    // Automatically add to Kanban as Todo
    updateNode(newId, { kanbanStatus: "todo", title: "New Subtask" })
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
      draggable={!isEditing}
      onDragStart={handleDragStart as any}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={cn(
        "group relative p-4 rounded-lg border border-slate-200 cursor-pointer transition-all hover:shadow-md",
        getStatusStyles(),
        selectedNodeId === node.id && "ring-2 ring-blue-500",
      )}
      whileHover={{ y: isEditing ? 0 : -2 }}
      whileTap={{ scale: isEditing ? 1 : 0.98 }}
    >
      {/* Parent Indicator */}
      {parentNode && (
        <div className="flex items-center gap-1 mb-2 text-xs font-medium text-slate-400">
          <CornerDownRight className="h-3 w-3" />
          <span className="truncate max-w-[150px]">{parentNode.title}</span>
        </div>
      )}

      {/* Card content */}
      {isEditing ? (
        <input
          ref={inputRef}
          defaultValue={node.title}
          onBlur={handleTitleSubmit}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          className="w-full bg-transparent font-medium text-slate-800 outline-none border-b border-blue-500 pb-0.5"
        />
      ) : (
        <h4 className="font-medium text-slate-800 pr-8 wrap-break-word">{node.title}</h4>
      )}

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
          <DropdownMenuItem onClick={() => setIsEditing(true)}>
            <Edit3 className="mr-2 h-4 w-4" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleAddSubtask}>
            <Plus className="mr-2 h-4 w-4" />
            Add Subtask
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenNotes}>
            <FileText className="mr-2 h-4 w-4" />
            Open Notes
          </DropdownMenuItem>
          <DropdownMenuSeparator />
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
