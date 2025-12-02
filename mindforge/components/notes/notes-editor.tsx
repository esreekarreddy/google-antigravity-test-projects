"use client"

import { useStore } from "@/store/use-store"
import { useState, useEffect, useCallback } from "react"
import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Eye, Edit3, Save, ChevronLeft, Trash2, Kanban } from "lucide-react"
import { motion } from "framer-motion"

export function NotesEditor() {
  const { nodes, selectedNodeId, updateNode, setView, deleteNode, convertToKanban } = useStore()
  const [isPreview, setIsPreview] = useState(false)
  const [localNotes, setLocalNotes] = useState("")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)

  const selectedNode = selectedNodeId ? nodes[selectedNodeId] : null

  useEffect(() => {
    if (selectedNode) {
      setLocalNotes(selectedNode.notes)
      setHasUnsavedChanges(false)
    }
  }, [selectedNode])

  const handleSave = useCallback(() => {
    if (selectedNodeId && localNotes !== selectedNode?.notes) {
      updateNode(selectedNodeId, { notes: localNotes })
      setHasUnsavedChanges(false)
    }
  }, [selectedNodeId, localNotes, selectedNode?.notes, updateNode])

  // Auto-save on Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleSave])

  // Auto-save after delay
  useEffect(() => {
    if (!hasUnsavedChanges) return
    const timer = setTimeout(handleSave, 2000)
    return () => clearTimeout(timer)
  }, [localNotes, hasUnsavedChanges, handleSave])

  const handleDelete = () => {
    if (selectedNodeId && selectedNodeId !== "root") {
      deleteNode(selectedNodeId)
      setView("mindmap")
    }
  }

  const handleToggleKanban = () => {
    if (!selectedNodeId) return
    if (selectedNode?.kanbanStatus) {
      updateNode(selectedNodeId, { kanbanStatus: undefined })
    } else {
      convertToKanban(selectedNodeId)
    }
  }

  if (!selectedNode) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
        <div className="text-center text-slate-500">
          <p className="text-lg font-medium">No node selected</p>
          <p className="text-sm mt-1">Select a node from the mindmap or kanban board</p>
          <Button variant="outline" className="mt-4 bg-transparent" onClick={() => setView("mindmap")}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Go to Mindmap
          </Button>
        </div>
      </div>
    )
  }

  const getStatusBadge = () => {
    switch (selectedNode.kanbanStatus) {
      case "todo":
        return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">To Do</span>
      case "doing":
        return (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">In Progress</span>
        )
      case "done":
        return (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Done</span>
        )
      default:
        return null
    }
  }

  return (
    <motion.div
      className="h-full w-full flex flex-col bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setView("mindmap")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            {isEditingTitle ? (
              <input
                autoFocus
                type="text"
                defaultValue={selectedNode.title}
                onBlur={(e) => {
                  setIsEditingTitle(false)
                  if (e.target.value.trim() && selectedNodeId) {
                    updateNode(selectedNodeId, { title: e.target.value })
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setIsEditingTitle(false)
                    if (e.currentTarget.value.trim() && selectedNodeId) {
                      updateNode(selectedNodeId, { title: e.currentTarget.value })
                    }
                  } else if (e.key === "Escape") {
                    setIsEditingTitle(false)
                  }
                }}
                className="font-semibold text-lg text-slate-800 border-b border-blue-500 outline-none bg-transparent min-w-[200px]"
              />
            ) : (
              <div className="flex items-center gap-2 group">
                <h2 className="font-semibold text-lg text-slate-800">{selectedNode.title}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setIsEditingTitle(true)}
                >
                  <Edit3 className="h-3 w-3 text-slate-400" />
                </Button>
              </div>
            )}
            {getStatusBadge()}
            {hasUnsavedChanges && <span className="text-xs text-slate-400">Unsaved</span>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleKanban}
            className={cn(selectedNode.kanbanStatus && "text-amber-600")}
          >
            <Kanban className="mr-2 h-4 w-4" />
            {selectedNode.kanbanStatus ? "In Kanban" : "Add to Kanban"}
          </Button>

          <Button variant="ghost" size="sm" onClick={() => setIsPreview(!isPreview)}>
            {isPreview ? (
              <>
                <Edit3 className="mr-2 h-4 w-4" />
                Edit
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </>
            )}
          </Button>

          <Button size="sm" onClick={handleSave} disabled={!hasUnsavedChanges}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>

          {selectedNodeId !== "root" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Editor / Preview */}
      <div className="flex-1 overflow-hidden">
        {isPreview ? (
          <div className="h-full overflow-y-auto p-6 bg-slate-50">
            <article className="prose prose-slate max-w-3xl mx-auto">
              <ReactMarkdown>{localNotes || "*No notes yet. Click Edit to start writing.*"}</ReactMarkdown>
            </article>
          </div>
        ) : (
          <div className="h-full flex">
            {/* Editor */}
            <div className="flex-1 h-full border-r border-slate-200">
              <textarea
                value={localNotes}
                onChange={(e) => {
                  setLocalNotes(e.target.value)
                  setHasUnsavedChanges(true)
                }}
                placeholder="Start writing your notes here...

# Heading 1
## Heading 2

**Bold text** and *italic text*

- List item 1
- List item 2

> Blockquote

`inline code`"
                className={cn(
                  "w-full h-full p-6 bg-white resize-none font-mono text-sm text-slate-700",
                  "focus:outline-none placeholder:text-slate-400",
                )}
              />
            </div>

            {/* Live Preview */}
            <div className="hidden lg:block w-1/2 h-full overflow-y-auto p-6 bg-slate-50">
              <article className="prose prose-slate prose-sm max-w-none">
                <ReactMarkdown>{localNotes || "*Preview will appear here...*"}</ReactMarkdown>
              </article>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
