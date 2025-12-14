import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CheckCircle2, AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Onboarding() {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to ScreenTime Analytics",
      description: "Track your browsing habits with complete privacy - all data stays on your computer.",
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-primary/20 to-accent/10 rounded-2xl p-6">
            <p className="text-foreground mb-3">This dashboard needs the Chrome Extension to collect data.</p>
            <p className="text-sm text-muted-foreground">Without the extension, the dashboard can only display imported data or data synced from other sessions.</p>
          </div>
        </div>
      )
    },
    {
      title: "Install the Extension",
      description: "3 simple steps to get tracking",
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="glassmorphic-light rounded-xl p-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <p className="font-medium">Open Chrome Extensions</p>
                  <p className="text-xs text-muted-foreground">Go to <code className="bg-background/50 px-2 py-1 rounded">chrome://extensions/</code></p>
                </div>
              </div>
            </div>

            <div className="glassmorphic-light rounded-xl p-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <p className="font-medium">Enable Developer Mode</p>
                  <p className="text-xs text-muted-foreground">Toggle "Developer mode" in top-right corner</p>
                </div>
              </div>
            </div>

            <div className="glassmorphic-light rounded-xl p-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <p className="font-medium">Load Unpacked Extension</p>
                  <p className="text-xs text-muted-foreground">Click "Load unpacked" → Select <code className="bg-background/50 px-2 py-1 rounded">extension/</code> folder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Data Collection",
      description: "How your data flows",
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-primary/20 via-accent/20 to-primary/10 rounded-2xl p-6">
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-primary/30 flex items-center justify-center text-primary font-bold">1</div>
                <span>Extension tracks your browsing activity</span>
              </div>
              <div className="h-6 border-l-2 border-primary/30 ml-4"></div>
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-primary/30 flex items-center justify-center text-primary font-bold">2</div>
                <span>Data syncs to localStorage automatically</span>
              </div>
              <div className="h-6 border-l-2 border-primary/30 ml-4"></div>
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-primary/30 flex items-center justify-center text-primary font-bold">3</div>
                <span>Dashboard displays analytics in real-time</span>
              </div>
            </div>
          </div>

          <div className="glassmorphic-light rounded-xl p-4">
            <p className="text-sm"><span className="font-semibold text-primary">All data stays local</span> - nothing is sent to any server</p>
          </div>
        </div>
      )
    },
    {
      title: "What Gets Tracked",
      description: "Your privacy-first tracking system",
      content: (
        <div className="space-y-4">
          <div className="grid gap-3">
            <div className="glassmorphic-light rounded-xl p-4">
              <div className="flex gap-2 mb-2">
                <CheckCircle2 className="size-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="font-medium text-sm">Website domains visited</p>
              </div>
              <p className="text-xs text-muted-foreground pl-6">github.com, youtube.com, etc.</p>
            </div>

            <div className="glassmorphic-light rounded-xl p-4">
              <div className="flex gap-2 mb-2">
                <CheckCircle2 className="size-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="font-medium text-sm">Time spent per site</p>
              </div>
              <p className="text-xs text-muted-foreground pl-6">Measured in minutes and seconds</p>
            </div>

            <div className="glassmorphic-light rounded-xl p-4">
              <div className="flex gap-2 mb-2">
                <CheckCircle2 className="size-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="font-medium text-sm">Visit frequency</p>
              </div>
              <p className="text-xs text-muted-foreground pl-6">How many times you visit each site</p>
            </div>
          </div>

          <div className="glassmorphic-light rounded-xl p-4 border-l-2 border-amber-500">
            <div className="flex gap-2">
              <AlertCircle className="size-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm mb-1">What's NOT tracked</p>
                <p className="text-xs text-muted-foreground">Search queries, passwords, page content, or personal info</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Productivity Score",
      description: "Automatic productivity analysis",
      content: (
        <div className="space-y-4">
          <div className="glassmorphic-light rounded-xl p-4">
            <p className="font-medium mb-3">Productive Websites (100%)</p>
            <p className="text-xs text-muted-foreground space-y-1">
              <div>• github.com, stackoverflow.com, figma.com</div>
              <div>• notion.so, docs.google.com</div>
              <div>• Local development (localhost)</div>
            </p>
          </div>

          <div className="glassmorphic-light rounded-xl p-4">
            <p className="font-medium mb-3">Unproductive Websites (0%)</p>
            <p className="text-xs text-muted-foreground space-y-1">
              <div>• facebook.com, twitter.com, instagram.com</div>
              <div>• youtube.com, netflix.com, reddit.com</div>
              <div>• TikTok, Twitch, and similar</div>
            </p>
          </div>

          <div className="glassmorphic-light rounded-xl p-4">
            <p className="font-medium mb-3">Neutral Websites (50%)</p>
            <p className="text-xs text-muted-foreground">Everything else is counted as 50% productive</p>
          </div>

          <div className="bg-gradient-to-r from-emerald-400/20 to-emerald-500/10 rounded-xl p-4 mt-4">
            <p className="font-mono text-sm">Score = (Productive Time) / (Total Time) × 100</p>
          </div>
        </div>
      )
    },
    {
      title: "You're All Set!",
      description: "Start browsing and watch your data appear",
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-8 text-center">
            <CheckCircle2 className="size-12 text-primary mx-auto mb-3" />
            <p className="text-lg font-semibold mb-2">Everything is ready!</p>
            <p className="text-sm text-muted-foreground">The extension is installed and tracking is active.</p>
          </div>

          <div className="space-y-3">
            <div className="glassmorphic-light rounded-xl p-4">
              <p className="font-medium text-sm mb-2">Next steps:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>✓ Open a few different websites</li>
                <li>✓ Switch between tabs a few times</li>
                <li>✓ Wait 5-10 seconds for data to sync</li>
                <li>✓ Refresh this page to see your data</li>
              </ul>
            </div>

            <div className="glassmorphic-light rounded-xl p-4">
              <p className="font-medium text-sm mb-2">Your data will appear in:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>📊 Dashboard - Overview of today</li>
                <li>📅 Daily - Detailed site breakdown</li>
                <li>📈 Weekly - 7-day trends</li>
                <li>👁️ Visits - Visit patterns</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentStep = steps[step];

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex gap-2">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 flex-1 rounded-full transition-all ${
                  idx <= step
                    ? "bg-gradient-to-r from-primary to-accent"
                    : "bg-white/20"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Step {step + 1} of {steps.length}</p>
        </div>

        {/* Content */}
        <div className="glassmorphic-card rounded-3xl p-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {currentStep.title}
          </h1>
          <p className="text-muted-foreground mb-8">{currentStep.description}</p>

          <div className="mb-8">
            {currentStep.content}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-between">
            <Button
              onClick={() => setStep(Math.max(0, step - 1))}
              variant="outline"
              className="glassmorphic-light"
              disabled={step === 0}
            >
              Back
            </Button>

            <div className="flex gap-3">
              {step < steps.length - 1 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={() => window.location.href = '/projects/screentime-analytics/'}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                  Go to Dashboard
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            💡 Need help? Check the{" "}
            <a href="#" className="text-primary hover:underline">EXTENSION_INSTALLATION_GUIDE.md</a>
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
