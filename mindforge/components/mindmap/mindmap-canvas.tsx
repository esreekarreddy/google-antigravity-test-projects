"use client"

import type React from "react"
import { useStore, type MindmapNode } from "@/store/use-store"
import { useCallback, useEffect, useRef, useState } from "react"
import { NodeItem } from "./node-item"
import { Edge } from "./edge"
import { motion } from "framer-motion"
import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MindmapCanvas() {
  const { nodes, selectedNodeId, preferences, setSelectedNode, createNode, setZoom, setCanvasOffset, updateNode } =
    useStore()

  const containerRef = useRef<HTMLDivElement>(null)
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })

  const { zoom, canvasOffset } = preferences

  // Handle wheel zoom
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -0.1 : 0.1
        setZoom(zoom + delta)
      } else {
        // Pan with scroll
        setCanvasOffset({
          x: canvasOffset.x - e.deltaX,
          y: canvasOffset.y - e.deltaY,
        })
      }
    },
    [zoom, canvasOffset, setZoom, setCanvasOffset],
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener("wheel", handleWheel, { passive: false })
    return () => container.removeEventListener("wheel", handleWheel)
  }, [handleWheel])

  // Handle pan with middle mouse or alt+drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      e.preventDefault()
      setIsPanning(true)
      setPanStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y })
    } else if (
      e.target === containerRef.current ||
      (e.target as HTMLElement).tagName === "svg" ||
      (e.target as HTMLElement).closest("svg")
    ) {
      // Only deselect if clicking on the canvas background or SVG
      const target = e.target as HTMLElement
      if (target === containerRef.current || target.classList.contains("canvas-bg")) {
        setSelectedNode(null)
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setCanvasOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false)
  }

  // Double click to create new root node
  const handleDoubleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target === containerRef.current || target.classList.contains("canvas-bg")) {
      const rect = containerRef.current!.getBoundingClientRect()
      const x = (e.clientX - rect.left - canvasOffset.x) / zoom
      const y = (e.clientY - rect.top - canvasOffset.y) / zoom

      const id = createNode()
      updateNode(id, { x, y })
    }
  }

  const handleAddNewNode = () => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = (rect.width / 2 - canvasOffset.x) / zoom
    const centerY = (rect.height / 2 - canvasOffset.y) / zoom

    const id = createNode()
    updateNode(id, { x: centerX, y: centerY })
  }

  // Get all edges (parent-child connections)
  const edges: { from: MindmapNode; to: MindmapNode }[] = []
  Object.values(nodes).forEach((node) => {
    if (node.parentId && nodes[node.parentId]) {
      edges.push({ from: nodes[node.parentId], to: node })
    }
  })

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-full w-full overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100",
        isPanning ? "cursor-grabbing" : "cursor-default",
      )}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    >
      {/* Grid pattern background */}
      <div
        className="canvas-bg absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #cbd5e1 1px, transparent 1px)`,
          backgroundSize: `${24 * zoom}px ${24 * zoom}px`,
          backgroundPosition: `${canvasOffset.x}px ${canvasOffset.y}px`,
        }}
      />

      {/* Canvas content */}
      <motion.div
        className="absolute"
        style={{
          transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
        }}
      >
        {/* SVG for edges */}
        <svg
          className="absolute pointer-events-none"
          style={{
            width: "4000px",
            height: "4000px",
            left: "-2000px",
            top: "-2000px",
          }}
        >
          {edges.map((edge) => (
            <Edge key={`${edge.from.id}-${edge.to.id}`} from={edge.from} to={edge.to} />
          ))}
        </svg>

        {/* Nodes */}
        {Object.values(nodes).map((node) => (
          <NodeItem key={node.id} node={node} isSelected={node.id === selectedNodeId} />
        ))}
      </motion.div>

      {/* Floating Action Button */}
      <Button
        onClick={handleAddNewNode}
        size="lg"
        className="absolute bottom-20 right-6 rounded-full h-14 w-14 p-0 shadow-lg bg-blue-500 hover:bg-blue-600 text-white"
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">Add new node</span>
      </Button>

      {/* Zoom controls */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2 rounded-xl bg-white shadow-lg border border-slate-200 px-2 py-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(zoom - 0.25)}>
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-14 text-center text-sm font-medium text-slate-600">{Math.round(zoom * 100)}%</span>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(zoom + 0.25)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Help text */}
      <div className="absolute bottom-6 left-6 text-xs text-slate-400 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-200">
        <p>Double-click to create node</p>
        <p>Alt+drag to pan canvas</p>
      </div>
    </div>
  )
}

// Helper function
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
