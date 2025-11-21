import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Home } from "lucide-react";
import CurrencySelect from "@/components/CurrencySelect";
import generatedImage from '@assets/generated_images/abstract_dark_professional_background_with_glowing_nodes.png';

export default function Charts() {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");

  const { data: rateData, isLoading } = useQuery({
    queryKey: ["exchange-rate", from, to],
    queryFn: async () => {
      const res = await fetch(`/api/rates/${from}/${to}`);
      if (!res.ok) throw new Error("Failed to fetch rate");
      return res.json();
    },
    refetchInterval: 60000,
  });

  const currentRate = rateData?.rate || 0;
  const timestamp = rateData?.timestamp;

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col font-sans relative overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${generatedImage})` }}
        />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-card/30 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/50">
              <span className="text-primary font-bold font-display">₹</span>
            </div>
            <span className="font-display font-bold text-lg md:text-xl">Currency Converter</span>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 container mx-auto px-4 py-8 md:py-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Current Exchange Rate</h1>
          <p className="text-muted-foreground mb-8">Live rate data from Frankfurter API</p>

          {/* Currency Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <CurrencySelect value={from} onChange={setFrom} label="From" />
            <CurrencySelect value={to} onChange={setTo} label="To" />
          </div>

          {/* Rate Card */}
          <Card className="glass-card p-6 md:p-8 w-full">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading rate...</p>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Exchange Rate</p>
                  <p className="text-4xl md:text-6xl font-display font-bold text-gradient-primary">
                    {currentRate.toFixed(4)}
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs md:text-sm text-muted-foreground">
                    1 {from} = {currentRate.toFixed(4)} {to}
                  </p>
                  {timestamp && (
                    <p className="text-xs text-muted-foreground/60 mt-2">
                      Last updated: {new Date(timestamp).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            )}
          </Card>

          {/* Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="glass-card p-4">
              <h3 className="font-medium text-sm mb-2">Market Data</h3>
              <p className="text-xs text-muted-foreground">
                Real-time rates updated every minute from the European Central Bank
              </p>
            </Card>
            <Card className="glass-card p-4">
              <h3 className="font-medium text-sm mb-2">Accuracy</h3>
              <p className="text-xs text-muted-foreground">
                All rates are verified and pulled directly from official sources
              </p>
            </Card>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-card/30 backdrop-blur-md mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-xs md:text-sm text-muted-foreground">
          <p>
            Real-time exchange rates provided by{" "}
            <a
              href="https://frankfurter.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Frankfurter API
            </a>
            {" "}• Powered by European Central Bank data
          </p>
        </div>
      </footer>
    </div>
  );
}
