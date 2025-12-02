"use client"

import { useStore } from "@/store/use-store"
import { useEffect } from "react"

export function KeyboardHandler() {
  const { setView, createNode, deleteNode, selectedNodeId, setSelectedNode } = useStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key) {
        case "1":
          setView("mindmap")
          break
        case "2":
          setView("kanban")
          break
        case "3":
          setView("notes")
          break
        case "n":
        case "N":
          if (!e.ctrlKey && !e.metaKey) {
            createNode(selectedNodeId || undefined)
          }
          break
        case "Delete":
        case "Backspace":
          if (selectedNodeId && selectedNodeId !== "root") {
            deleteNode(selectedNodeId)
          }
          break
        case "Escape":
          setSelectedNode(null)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [setView, createNode, deleteNode, selectedNodeId, setSelectedNode])

  return null
}
