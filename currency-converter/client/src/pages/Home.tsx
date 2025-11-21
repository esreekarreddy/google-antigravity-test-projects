import { useState, useEffect } from "react";
import { SignatureBadge } from "@/components/SignatureBadge";
import { useQuery } from "@tanstack/react-query";
import CurrencyConverter from "@/components/CurrencyConverter";
import RateChart from "@/components/RateChart";
import CurrencyTicker from "@/components/CurrencyTicker";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { TrendingUp, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import generatedImage from '@assets/generated_images/abstract_dark_professional_background_with_glowing_nodes.png';

export default function Home() {
  const [amount, setAmount] = useState(1000);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [rate, setRate] = useState<number | null>(null);

  const { data: rateData, isLoading, refetch } = useQuery({
    queryKey: ["exchange-rate", from, to],
    queryFn: async () => {
      const res = await fetch(`/api/rates/${from}/${to}`);
      if (!res.ok) throw new Error("Failed to fetch rate");
      return res.json();
    },
    refetchInterval: 60000,
    retry: 2,
  });

  useEffect(() => {
    if (rateData?.rate) {
      setRate(rateData.rate);
    }
  }, [rateData]);

  useEffect(() => {
    refetch();
  }, [from, to, refetch]);

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col font-sans relative overflow-x-hidden">
      {/* Background Image Layer */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${generatedImage})` }}
        />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />
      </div>

      {/* Navbar */}
      <header className="relative z-10 border-b border-white/5 bg-card/30 backdrop-blur-md sticky top-0">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/50">
              <span className="text-primary font-bold font-display text-xl">₹</span>
            </div>
            <span className="font-display font-bold text-lg md:text-xl tracking-tight">Currency Converter</span>
          </div>
          
          <nav className="flex flex-wrap items-center justify-end gap-2 md:gap-4 text-xs md:text-sm font-medium">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-foreground hover:text-primary">
                Converter
              </Button>
            </Link>
            <Link href="/charts">
              <Button variant="ghost" size="sm" className="hover:text-primary flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Charts</span>
              </Button>
            </Link>
            <Link href="/rates">
              <Button variant="ghost" size="sm" className="hover:text-primary flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Rates</span>
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Ticker */}
      <div className="relative z-10 overflow-x-hidden">
        <CurrencyTicker />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 container mx-auto px-3 md:px-4 py-8 md:py-20 w-full">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 md:gap-8 w-full max-w-6xl mx-auto">
          
          {/* Left Column: Converter */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <div className="mb-6 md:mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-3 md:mb-4 leading-tight">
                Global Currency <br />
                <span className="text-gradient-primary">Live Conversion</span>
              </h1>
              <p className="text-muted-foreground text-sm md:text-lg max-w-md">
                Real-time exchange rates powered by live market data. Convert between 25+ currencies instantly.
              </p>
            </div>
            
            <CurrencyConverter 
              amount={amount} 
              setAmount={setAmount}
              from={from}
              setFrom={setFrom}
              to={to}
              setTo={setTo}
              rate={rate}
              isLoading={isLoading}
            />
          </motion.div>

          {/* Right Column: Charts & Stats */}
          <div className="space-y-4 md:space-y-6 w-full pt-0 lg:pt-24">
            {rate !== null && (
              <div className="h-[250px] md:h-[300px]">
                <RateChart 
                  fromCurrency={from} 
                  toCurrency={to} 
                  currentRate={rate} 
                />
              </div>
            )}

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-3 md:gap-4"
            >
              <Card className="glass-card p-3 md:p-4 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-default">
                <span className="text-2xl md:text-3xl font-display font-bold text-primary mb-1">Live</span>
                <span className="text-xs md:text-sm text-muted-foreground">Market Data</span>
              </Card>
              <Card className="glass-card p-3 md:p-4 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-default">
                <span className="text-2xl md:text-3xl font-display font-bold text-emerald-400 mb-1">25+</span>
                <span className="text-xs md:text-sm text-muted-foreground">Currencies</span>
              </Card>
            </motion.div>
          </div>

        </div>
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
      <SignatureBadge />
    </div>
  );
}
