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

const generateId = () => Math.random().toString(36).substring(2, 15)

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
          const data = JSON.parse(json)
          if (data.nodes && typeof data.nodes === "object") {
            set({
              nodes: data.nodes,
              selectedNodeId: null,
              view: data.view || "mindmap",
              preferences: data.preferences || {
                zoom: 1,
                canvasOffset: { x: 0, y: 0 },
                collapsedNodes: [],
              },
            })
            return true
          }
          return false
        } catch {
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
