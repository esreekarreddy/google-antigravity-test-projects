import type React from "react"
import { useStore } from "@/store/use-store"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Network, Kanban, FileText, Download, Upload, RotateCcw, Keyboard } from "lucide-react"
import { useRef, useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function Sidebar() {
  const { view, setView, exportState, importState, resetWorkspace } = useStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showShortcuts, setShowShortcuts] = useState(false)

  const handleExport = () => {
    const data = exportState()
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `mindforge-workspace-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      const success = importState(content)
      if (!success) {
        alert("Failed to import workspace. Invalid file format.")
      }
    }
    reader.readAsText(file)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const navItems = [
    { id: "mindmap" as const, icon: Network, label: "Mindmap", shortcut: "1" },
    { id: "kanban" as const, icon: Kanban, label: "Kanban", shortcut: "2" },
    { id: "notes" as const, icon: FileText, label: "Notes", shortcut: "3" },
  ]

  const shortcuts = [
    { key: "1", action: "Mindmap view" },
    { key: "2", action: "Kanban view" },
    { key: "3", action: "Notes view" },
    { key: "N", action: "New node (child of selected)" },
    { key: "Delete", action: "Delete selected node" },
    { key: "Ctrl+S", action: "Save notes" },
    { key: "Escape", action: "Deselect node" },
    { key: "Alt+Drag", action: "Pan canvas" },
    { key: "Scroll", action: "Pan canvas" },
    { key: "Ctrl+Scroll", action: "Zoom in/out" },
  ]

  return (
    <TooltipProvider delayDuration={300}>
      <aside className="fixed left-0 top-0 z-50 flex h-full w-16 flex-col items-center gap-2 border-r border-slate-200 bg-white py-4 shadow-sm">
        {/* Logo */}
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-md">
          <img src="/icon.svg" alt="MindForge" className="h-6 w-6" />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-10 w-10 rounded-xl transition-all",
                    view === item.id
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-100",
                  )}
                  onClick={() => setView(item.id)}
                >
                  <item.icon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>
                  {item.label} <span className="ml-2 text-slate-400 text-xs">({item.shortcut})</span>
                </p>
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="mt-auto flex flex-col gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                onClick={handleExport}
              >
                <Download className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Export Workspace</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Import Workspace</TooltipContent>
          </Tooltip>

          <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />

          <AlertDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="right">Reset Workspace</TooltipContent>
            </Tooltip>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Workspace?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your nodes, tasks, and notes. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={resetWorkspace} className="bg-red-600 hover:bg-red-700">
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              >
                <Keyboard className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Keyboard Shortcuts</DialogTitle>
                <DialogDescription>Quick actions to speed up your workflow</DialogDescription>
              </DialogHeader>
              <div className="grid gap-2 py-4">
                {shortcuts.map((shortcut) => (
                  <div key={shortcut.key} className="flex items-center justify-between py-1">
                    <span className="text-sm text-slate-600">{shortcut.action}</span>
                    <kbd className="rounded-md bg-slate-100 px-2 py-1 text-xs font-mono text-slate-700 border border-slate-200">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </aside>
    </TooltipProvider>
  )
}
