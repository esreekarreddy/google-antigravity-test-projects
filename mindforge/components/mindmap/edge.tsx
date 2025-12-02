"use client"

import type { MindmapNode } from "@/store/use-store"

interface EdgeProps {
  from: MindmapNode
  to: MindmapNode
}

export function Edge({ from, to }: EdgeProps) {
  // SVG offset to handle negative coordinates
  const offsetX = 2000
  const offsetY = 2000

  // Source and target positions
  const x1 = from.x + offsetX
  const y1 = from.y + offsetY
  const x2 = to.x + offsetX
  const y2 = to.y + offsetY

  // Calculate direction and distance
  const dx = x2 - x1
  const dy = y2 - y1
  const distance = Math.sqrt(dx * dx + dy * dy)

  // Control point offset (creates smooth curve)
  const curvature = Math.min(distance * 0.3, 80)

  // Horizontal bezier curve (flows left to right naturally)
  const cx1 = x1 + curvature
  const cy1 = y1
  const cx2 = x2 - curvature
  const cy2 = y2

  const path = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`

  return (
    <g>
      {/* Shadow/glow effect */}
      <path d={path} fill="none" stroke="rgba(100, 116, 139, 0.1)" strokeWidth={6} strokeLinecap="round" />
      {/* Main line */}
      <path d={path} fill="none" stroke="#94a3b8" strokeWidth={2} strokeLinecap="round" className="transition-colors" />
    </g>
  )
}
