import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { SoftButton } from "@/components/ui/SoftButton";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { storage } from "@/lib/storage";
import { Download, Upload, AlertCircle, Trash2, Check, X, Volume2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AnimatedPageWrapper } from "@/components/ui/AnimatedPageWrapper";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  const { toast } = useToast();
  const [importText, setImportText] = useState("");
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleExport = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (exporting) return;
    setExporting(true);
    
    try {
      const data = await storage.getData();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `screentime-analytics-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Your data has been downloaded.",
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export Failed",
        description: "Could not export data.",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (importing) return;
    
    if (!importText.trim()) {
      toast({
        title: "Empty Input",
        description: "Please paste your JSON backup text first.",
        variant: "destructive",
      });
      return;
    }
    
    setImporting(true);
    
    try {
      const success = await storage.importData(importText);
      if (success) {
        toast({
          title: "Import Successful",
          description: "Data has been updated.",
        });
        setImportText("");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast({
          title: "Import Failed",
          description: "Invalid JSON format.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Import Error",
        description: "An error occurred.",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const handleClearData = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const confirmed = window.confirm(
      "Are you absolutely sure? This will permanently delete all your data."
    );
    
    if (!confirmed) return;
    
    setClearing(true);
    
    try {
      await storage.setData({});
      toast({
        title: "Data Cleared",
        description: "All your activity data has been deleted.",
      });
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error("Clear error:", error);
      toast({
        title: "Clear Failed",
        description: "Could not clear data.",
        variant: "destructive",
      });
      setClearing(false);
    }
  };

  return (
    <DashboardLayout>
      <AnimatedPageWrapper>
        <div className="mb-8 sm:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent inline-block">
              Settings
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground font-medium">
              Manage your data and preferences.
            </p>
          </motion.div>
        </div>

        <div className="space-y-4 sm:space-y-6 w-full max-w-5xl">
          {/* Preferences */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-[32px] p-6 sm:p-8"
          >
             <CardHeader className="p-0 mb-6">
              <CardTitle className="text-lg sm:text-xl font-bold">Preferences</CardTitle>
              <CardDescription className="text-sm">Customize your dashboard experience.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Volume2 className="size-4 text-primary" />
                    Sound Effects
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Play subtle sounds when interacting with the UI
                  </p>
                </div>
                <Switch
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
              </div>
            </CardContent>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-[32px] p-6 sm:p-8"
          >
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-lg sm:text-xl font-bold">Data Management</CardTitle>
              <CardDescription className="text-sm">Export your analytics data or import a backup.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-6 sm:space-y-8">
              
              {/* Export Section */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold block">Export Data</Label>
                <p className="text-sm text-muted-foreground mb-3">Download a backup of all your tracking data as JSON.</p>
                <SoftButton 
                  onClick={handleExport}
                  disabled={exporting}
                  className="bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/20 text-white w-full sm:w-auto rounded-xl h-12 px-6"
                  soundEnabled={soundEnabled}
                >
                  <Download className="mr-2 size-4" />
                  {exporting ? "Exporting..." : "Download JSON Backup"}
                </SoftButton>
              </div>

              <div className="h-px bg-gradient-to-r from-black/5 via-black/10 to-transparent dark:from-white/5 dark:via-white/10"></div>

              {/* Import Section */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold block">Import Data</Label>
                <p className="text-sm text-muted-foreground mb-3">Paste your JSON backup to restore data.</p>
                <div className="flex flex-col gap-3">
                  <textarea
                    placeholder="Paste your JSON backup content here..."
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    className="flex-1 px-4 py-3 min-h-[120px] bg-white/50 dark:bg-black/20 rounded-2xl border border-black/5 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-sm"
                  />
                  <SoftButton
                    onClick={handleImport}
                    disabled={importing || !importText.trim()}
                    className="sm:self-end bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/20 text-white w-full sm:w-auto rounded-xl h-12 px-6"
                    soundEnabled={soundEnabled}
                  >
                    <Upload className="mr-2 size-4" />
                    {importing ? "Importing..." : "Import"}
                  </SoftButton>
                </div>
                <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mt-2 font-medium bg-amber-500/10 p-2 rounded-lg inline-block">
                  <AlertCircle className="size-3.5 flex-shrink-0" />
                  Warning: This will overwrite all existing data.
                </p>
              </div>

              <div className="h-px bg-gradient-to-r from-black/5 via-black/10 to-transparent dark:from-white/5 dark:via-white/10"></div>

              {/* Clear Section */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold block text-red-600 dark:text-red-400">Danger Zone</Label>
                <p className="text-sm text-muted-foreground mb-3">Permanently delete all your activity records.</p>
                <SoftButton
                  onClick={handleClearData}
                  disabled={clearing}
                  variant="outline"
                  className="border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 w-full sm:w-auto rounded-xl h-12 px-6"
                  soundEnabled={soundEnabled}
                >
                  <Trash2 className="mr-2 size-4" />
                  {clearing ? "Deleting..." : "Delete All Data"}
                </SoftButton>
              </div>

            </CardContent>
          </motion.div>

          {/* Storage Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-[32px] p-6 sm:p-8"
          >
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-lg sm:text-xl font-bold">Storage Information</CardTitle>
              <CardDescription className="text-sm">How your data is stored and managed.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                  <Check className="size-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm text-emerald-700 dark:text-emerald-400">Local Storage</p>
                    <p className="text-xs text-emerald-600/80 dark:text-emerald-500/80">All data stored in browser</p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                  <Check className="size-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                   <div>
                    <p className="font-bold text-sm text-emerald-700 dark:text-emerald-400">Private</p>
                    <p className="text-xs text-emerald-600/80 dark:text-emerald-500/80">No data sent to any server</p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                  <Check className="size-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                   <div>
                    <p className="font-bold text-sm text-emerald-700 dark:text-emerald-400">Persistent</p>
                    <p className="text-xs text-emerald-600/80 dark:text-emerald-500/80">Survives browser restart</p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                  <X className="size-5 text-red-500 flex-shrink-0 mt-0.5" />
                   <div>
                    <p className="font-bold text-sm text-red-700 dark:text-red-400">Cache Sensitive</p>
                    <p className="text-xs text-red-600/80 dark:text-red-500/80">Deleting cache erases data</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </motion.div>
        </div>
      </AnimatedPageWrapper>
    </DashboardLayout>
  );
}
