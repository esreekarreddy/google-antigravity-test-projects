import { create } from "zustand"
import { persist } from "zustand/middleware"

export type KanbanStatus = "todo" | "doing" | "done"
export type ViewType = "mindmap" | "kanban" | "notes"

export interface MindmapNode {
  id: string
  title: string
  x: number
  y: number
  parentId?: string
  children: string[]
  notes: string
  kanbanStatus?: KanbanStatus
  color?: string
}

interface UIPreferences {
  zoom: number
  canvasOffset: { x: number; y: number }
  collapsedNodes: string[]
}

interface MindForgeState {
  nodes: Record<string, MindmapNode>
  selectedNodeId: string | null
  view: ViewType
  preferences: UIPreferences

  // Actions
  createNode: (parentId?: string) => string
  updateNode: (id: string, partial: Partial<MindmapNode>) => void
  deleteNode: (id: string) => void
  setSelectedNode: (id: string | null) => void
  convertToKanban: (id: string) => void
  setKanbanStatus: (id: string, status: KanbanStatus) => void
  setView: (view: ViewType) => void
  setZoom: (zoom: number) => void
  setCanvasOffset: (offset: { x: number; y: number }) => void
  toggleCollapsedNode: (id: string) => void
  importState: (json: string) => boolean
  exportState: () => string
  resetWorkspace: () => void
}

// SECURITY: Use crypto.randomUUID for cryptographically strong unique IDs
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older environments (though unnecessary in modern browsers/node)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// ============ SECURITY UTILITIES ============

// Prototype pollution protection
function hasPrototypePollution(obj: unknown): boolean {
  if (obj === null || typeof obj !== 'object') return false
  
  const dangerousKeys = ['__proto__', 'constructor', 'prototype']
  
  const checkObject = (o: Record<string, unknown>): boolean => {
    for (const key of Object.keys(o)) {
      if (dangerousKeys.includes(key)) return true
      if (typeof o[key] === 'object' && o[key] !== null) {
        if (checkObject(o[key] as Record<string, unknown>)) return true
      }
    }
    return false
  }
  
  return checkObject(obj as Record<string, unknown>)
}

// Safe JSON parse
function safeJsonParse<T>(json: string): T | null {
  try {
    const parsed = JSON.parse(json)
    if (hasPrototypePollution(parsed)) {
      console.error('[Security] Blocked prototype pollution attempt')
      return null
    }
    return parsed as T
  } catch {
    return null
  }
}

// Validate MindmapNode structure
function isValidNode(item: unknown): item is MindmapNode {
  if (!item || typeof item !== 'object') return false
  const n = item as Record<string, unknown>
  return (
    typeof n.id === 'string' && n.id.length > 0 &&
    typeof n.title === 'string' &&
    typeof n.x === 'number' && isFinite(n.x) &&
    typeof n.y === 'number' && isFinite(n.y) &&
    Array.isArray(n.children) &&
    typeof n.notes === 'string'
  )
}

// Detect circular references in node children
function hasCircularReference(nodes: Record<string, MindmapNode>): boolean {
  const visited = new Set<string>()
  
  const checkNode = (nodeId: string, ancestors: Set<string>): boolean => {
    if (ancestors.has(nodeId)) return true
    if (visited.has(nodeId)) return false
    
    visited.add(nodeId)
    const node = nodes[nodeId]
    if (!node) return false
    
    const newAncestors = new Set(ancestors)
    newAncestors.add(nodeId)
    
    for (const childId of node.children) {
      if (checkNode(childId, newAncestors)) return true
    }
    
    return false
  }
  
  for (const nodeId of Object.keys(nodes)) {
    if (checkNode(nodeId, new Set())) return true
  }
  
  return false
}

// Escape HTML for XSS prevention
function escapeHtml(str: string): string {
  if (!str) return ''
  return str.replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[c] || c)
}

const initialNodes: Record<string, MindmapNode> = {
  root: {
    id: "root",
    title: "My Workspace",
    x: 200,  // LEFT side
    y: 300,  // Vertically centered
    children: ["task-1", "task-2", "task-3"],
    notes: `# Welcome to MindForge! 👋

Forge your ideas into reality across three powerful views:

## 🧠 Mind Map
Visualize your ideas and their connections. Double-click any node to edit.

## 📋 Kanban Board
Track tasks through: To Do → Doing → Done

## 📝 Notes
Take detailed markdown notes for each idea.

---

**Try this**: 
1. Explore the sample tasks below
2. Press **N** to create a new node
3. Press **2** to switch to Kanban view
4. Drag tasks between columns!`,
  },
  "task-1": {
    id: "task-1",
    title: "Research Market",
    x: 550,  // RIGHT side (350px gap from root)
    y: 150,  // TOP position
    parentId: "root",
    children: [],
    notes: `## ✅ Research Market

**Status**: Completed

### Key Findings
- Target audience identified
- Competitor analysis done
- Market opportunity validated

### Next Steps
→ Use insights to design MVP`,
    kanbanStatus: "done",
    color: "#10b981",
  },
  "task-2": {
    id: "task-2",
    title: "Design MVP",
    x: 550,  // RIGHT side (same as siblings)
    y: 300,  // MIDDLE position (aligned with root)
    parentId: "root",
    children: [],
    notes: `## 🔄 Design MVP

**Status**: In Progress

### Current Focus
- [x] User flow diagrams
- [x] Wireframes
- [ ] UI mockups
- [ ] Interactive prototype

### Resources
- Figma design file
- User research notes`,
    kanbanStatus: "doing",
    color: "#3b82f6",
  },
  "task-3": {
    id: "task-3",
    title: "Plan Launch",
    x: 550,  // RIGHT side (same as siblings)
    y: 450,  // BOTTOM position (150px spacing)
    parentId: "root",
    children: [],
    notes: `## 📋 Plan Launch

**Status**: To Do

### Launch Checklist
- [ ] Create landing page
- [ ] Set up analytics
- [ ] Prepare social media
- [ ] Write launch post
- [ ] Schedule launch date

### Timeline
Target: Next month`,
    kanbanStatus: "todo",
    color: "#8b5cf6",
  },
}

export const useStore = create<MindForgeState>()(
  persist(
    (set, get) => ({
      nodes: initialNodes,
      selectedNodeId: null,
      view: "mindmap",
      preferences: {
        zoom: 1,
        canvasOffset: { x: 0, y: 0 },
        collapsedNodes: [],
      },

      createNode: (parentId?: string) => {
        const id = generateId()
        const parent = parentId ? get().nodes[parentId] : null

        const newNode: MindmapNode = {
          id,
          title: "New Idea",
          x: parent ? parent.x + 200 : 400,
          y: parent ? parent.y + Math.random() * 100 - 50 : 300,
          parentId,
          children: [],
          notes: "",
        }

        set((state) => ({
          nodes: {
            ...state.nodes,
            [id]: newNode,
            ...(parentId && state.nodes[parentId]
              ? {
                  [parentId]: {
                    ...state.nodes[parentId],
                    children: [...state.nodes[parentId].children, id],
                  },
                }
              : {}),
          },
          selectedNodeId: id,
        }))

        return id
      },

      updateNode: (id, partial) => {
        set((state) => ({
          nodes: {
            ...state.nodes,
            [id]: { ...state.nodes[id], ...partial },
          },
        }))
      },

      deleteNode: (id) => {
        const state = get()
        const node = state.nodes[id]
        if (!node || id === "root") return

        // Recursively get all descendant IDs
        const getDescendants = (nodeId: string): string[] => {
          const n = state.nodes[nodeId]
          if (!n) return []
          return [nodeId, ...n.children.flatMap(getDescendants)]
        }

        const toDelete = new Set(getDescendants(id))

        set((state) => {
          const newNodes = { ...state.nodes }
          toDelete.forEach((nodeId) => delete newNodes[nodeId])

          // Remove from parent's children
          if (node.parentId && newNodes[node.parentId]) {
            newNodes[node.parentId] = {
              ...newNodes[node.parentId],
              children: newNodes[node.parentId].children.filter((c) => c !== id),
            }
          }

          return {
            nodes: newNodes,
            selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
          }
        })
      },

      setSelectedNode: (id) => set({ selectedNodeId: id }),

      convertToKanban: (id) => {
        set((state) => ({
          nodes: {
            ...state.nodes,
            [id]: { ...state.nodes[id], kanbanStatus: "todo" },
          },
        }))
      },

      setKanbanStatus: (id, status) => {
        set((state) => ({
          nodes: {
            ...state.nodes,
            [id]: { ...state.nodes[id], kanbanStatus: status },
          },
        }))
      },

      setView: (view) => set({ view }),

      setZoom: (zoom) => {
        set((state) => ({
          preferences: { ...state.preferences, zoom: Math.max(0.25, Math.min(2, zoom)) },
        }))
      },

      setCanvasOffset: (offset) => {
        set((state) => ({
          preferences: { ...state.preferences, canvasOffset: offset },
        }))
      },

      toggleCollapsedNode: (id) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            collapsedNodes: state.preferences.collapsedNodes.includes(id)
              ? state.preferences.collapsedNodes.filter((n) => n !== id)
              : [...state.preferences.collapsedNodes, id],
          },
        }))
      },

      importState: (json) => {
        try {
          // SECURITY: Limit input size to prevent DoS
          const MAX_JSON_SIZE = 5 * 1024 * 1024 // 5MB
          if (json.length > MAX_JSON_SIZE) {
            console.error('[Security] Import data too large')
            return false
          }
          
          // SECURITY: Use safe JSON parse with prototype pollution protection
          const data = safeJsonParse<{
            nodes?: Record<string, unknown>
            view?: unknown
            preferences?: unknown
          }>(json)
          
          if (!data) {
            console.error('[Security] Invalid or malicious JSON detected')
            return false
          }
          
          if (!data.nodes || typeof data.nodes !== 'object') {
            return false
          }
          
          // SECURITY: Validate and sanitize all nodes
          const validatedNodes: Record<string, MindmapNode> = {}
          const nodeIds = Object.keys(data.nodes)
          
          // Limit number of nodes to prevent DoS
          const MAX_NODES = 1000
          if (nodeIds.length > MAX_NODES) {
            console.error('[Security] Too many nodes in import')
            return false
          }
          
          for (const nodeId of nodeIds) {
            const node = data.nodes[nodeId]
            if (!isValidNode(node)) {
              console.error('[Security] Invalid node structure:', nodeId)
              continue
            }
            
            // Sanitize node content
            validatedNodes[nodeId] = {
              ...node,
              id: nodeId,
              title: escapeHtml(node.title),
              notes: escapeHtml(node.notes),
              // Validate children array contains only strings
              children: node.children.filter((c): c is string => typeof c === 'string'),
              // Clamp coordinates to reasonable bounds
              x: Math.max(-10000, Math.min(10000, node.x)),
              y: Math.max(-10000, Math.min(10000, node.y)),
            }
          }
          
          // Must have at least a root node
          if (!validatedNodes['root']) {
            console.error('[Security] No root node found in import')
            return false
          }
          
          // SECURITY: Check for circular references
          if (hasCircularReference(validatedNodes)) {
            console.error('[Security] Circular reference detected in node hierarchy')
            return false
          }
          
          // Validate view type
          const validViews = ['mindmap', 'kanban', 'notes'] as const
          const view = validViews.includes(data.view as ViewType) 
            ? (data.view as ViewType) 
            : 'mindmap'
          
          // Validate preferences
          const prefs = data.preferences as Record<string, unknown> | undefined
          const preferences: UIPreferences = {
            zoom: typeof prefs?.zoom === 'number' ? Math.max(0.25, Math.min(2, prefs.zoom)) : 1,
            canvasOffset: (
              typeof prefs?.canvasOffset === 'object' && prefs.canvasOffset !== null &&
              typeof (prefs.canvasOffset as Record<string, unknown>).x === 'number' &&
              typeof (prefs.canvasOffset as Record<string, unknown>).y === 'number'
            ) ? {
              x: Math.max(-10000, Math.min(10000, (prefs.canvasOffset as { x: number; y: number }).x)),
              y: Math.max(-10000, Math.min(10000, (prefs.canvasOffset as { x: number; y: number }).y)),
            } : { x: 0, y: 0 },
            collapsedNodes: Array.isArray(prefs?.collapsedNodes) 
              ? prefs.collapsedNodes.filter((n): n is string => typeof n === 'string')
              : [],
          }
          
          set({
            nodes: validatedNodes,
            selectedNodeId: null,
            view,
            preferences,
          })
          return true
        } catch (error) {
          console.error('[Security] Import failed:', error)
          return false
        }
      },

      exportState: () => {
        const state = get()
        return JSON.stringify(
          {
            nodes: state.nodes,
            view: state.view,
            preferences: state.preferences,
          },
          null,
          2,
        )
      },

      resetWorkspace: () => {
        set({
          nodes: initialNodes,
          selectedNodeId: null,
          view: "mindmap",
          preferences: {
            zoom: 1,
            canvasOffset: { x: 0, y: 0 },
            collapsedNodes: [],
          },
        })
      },
    }),
    {
      name: "mindforge-storage",
    },
  ),
)
