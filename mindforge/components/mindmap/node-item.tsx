"use client"

import type React from "react"
import { useStore, type MindmapNode } from "@/store/use-store"
import { cn } from "@/lib/utils"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trash2, FileText, GripVertical, Kanban } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface NodeItemProps {
  node: MindmapNode
  isSelected: boolean
}

export function NodeItem({ node, isSelected }: NodeItemProps) {
  const { setSelectedNode, updateNode, createNode, deleteNode, convertToKanban, setView } = useStore()

  const [isEditing, setIsEditing] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, nodeX: 0, nodeY: 0 })
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || isEditing) return
    e.stopPropagation()
    e.preventDefault()

    setSelectedNode(node.id)
    setIsDragging(true)
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      nodeX: node.x,
      nodeY: node.y,
    })
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const { zoom } = useStore.getState().preferences

      // Calculate delta from start position and apply to original node position
      const deltaX = (e.clientX - dragStart.x) / zoom
      const deltaY = (e.clientY - dragStart.y) / zoom

      updateNode(node.id, {
        x: dragStart.nodeX + deltaX,
        y: dragStart.nodeY + deltaY,
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, dragStart, node.id, updateNode])

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
  }

  const handleTitleSubmit = () => {
    setIsEditing(false)
  }

  const handleOpenNotes = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedNode(node.id)
    setView("notes")
  }

  const handleAddChild = (e: React.MouseEvent) => {
    e.stopPropagation()
    createNode(node.id)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (node.id !== "root") {
      deleteNode(node.id)
    }
  }

  const handleConvertToKanban = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (node.kanbanStatus) {
      updateNode(node.id, { kanbanStatus: undefined })
    } else {
      convertToKanban(node.id)
    }
  }

  const getStatusStyles = () => {
    switch (node.kanbanStatus) {
      case "todo":
        return {
          border: "border-blue-400",
          bg: "bg-blue-50",
          badge: "bg-blue-500 text-white",
          label: "To Do",
        }
      case "doing":
        return {
          border: "border-amber-400",
          bg: "bg-amber-50",
          badge: "bg-amber-500 text-white",
          label: "In Progress",
        }
      case "done":
        return {
          border: "border-emerald-400",
          bg: "bg-emerald-50",
          badge: "bg-emerald-500 text-white",
          label: "Done",
        }
      default:
        return {
          border: "border-slate-200",
          bg: "bg-white",
          badge: null,
          label: null,
        }
    }
  }

  const status = getStatusStyles()
  const showActions = isHovered || isSelected

  return (
    <TooltipProvider delayDuration={200}>
      <motion.div
        className={cn("absolute select-none", isDragging && "z-50")}
        style={{
          left: node.x,
          top: node.y,
          transform: "translate(-50%, -50%)",
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.15 }}
              className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white rounded-lg shadow-lg border border-slate-200 px-1 py-1 z-10"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 hover:bg-blue-50 hover:text-blue-600"
                    onClick={handleAddChild}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  Add child node
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 hover:bg-purple-50 hover:text-purple-600"
                    onClick={handleOpenNotes}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  Open notes
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className={cn(
                      "h-7 w-7",
                      node.kanbanStatus
                        ? "hover:bg-amber-50 hover:text-amber-600 text-amber-500"
                        : "hover:bg-slate-100",
                    )}
                    onClick={handleConvertToKanban}
                  >
                    <Kanban className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {node.kanbanStatus ? "Remove from Kanban" : "Add to Kanban"}
                </TooltipContent>
              </Tooltip>

              {node.id !== "root" && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 hover:bg-red-50 hover:text-red-600"
                      onClick={handleDelete}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    Delete node
                  </TooltipContent>
                </Tooltip>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className={cn(
            "relative flex flex-col items-center rounded-xl border-2 px-4 py-3 min-w-[140px] max-w-[200px] cursor-grab active:cursor-grabbing shadow-sm transition-shadow",
            status.bg,
            status.border,
            isSelected && "ring-2 ring-blue-500 ring-offset-2 shadow-md",
            isDragging && "shadow-xl opacity-90",
          )}
          whileHover={{ scale: isDragging ? 1 : 1.02 }}
          whileTap={{ scale: 0.98 }}
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
        >
          {/* Drag handle indicator */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 opacity-30">
            <GripVertical className="h-3 w-3" />
          </div>

          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={node.title}
              onChange={(e) => updateNode(node.id, { title: e.target.value })}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTitleSubmit()
                if (e.key === "Escape") setIsEditing(false)
              }}
              className="bg-transparent text-center text-sm font-semibold outline-none w-full min-w-[80px] text-slate-800"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="text-sm font-semibold text-slate-800 text-center leading-tight">{node.title}</span>
          )}

          {/* Status badge */}
          {status.label && (
            <span
              className={cn(
                "mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide",
                status.badge,
              )}
            >
              {status.label}
            </span>
          )}

          {/* Notes indicator */}
          {node.notes && node.notes.trim().length > 0 && (
            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-purple-500 rounded-full flex items-center justify-center">
              <FileText className="h-2.5 w-2.5 text-white" />
            </div>
          )}
        </motion.div>
      </motion.div>
    </TooltipProvider>
  )
}
