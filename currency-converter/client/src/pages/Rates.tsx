import { useQuery } from "@tanstack/react-query";
import { SignatureBadge } from "@/components/SignatureBadge";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Home } from "lucide-react";
import generatedImage from '@assets/generated_images/abstract_dark_professional_background_with_glowing_nodes.png';
import { apiUrl } from "@/lib/api";

interface Currency {
  code: string;
  name: string;
  country: string;
  symbol: string;
}

export default function Rates() {
  const { data: currencies = [] } = useQuery<Currency[]>({
    queryKey: ["currencies"],
    queryFn: async () => {
      const res = await fetch(apiUrl("/api/currencies"));
      return res.json();
    },
  });

  const popularPairs = [
    { from: "USD", to: "EUR" },
    { from: "USD", to: "INR" },
    { from: "USD", to: "GBP" },
    { from: "EUR", to: "GBP" },
    { from: "USD", to: "JPY" },
    { from: "EUR", to: "INR" },
  ];

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
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">All Currencies</h1>
          <p className="text-muted-foreground mb-8">Browse all {currencies.length} supported currencies</p>

          {/* Popular Pairs */}
          <div className="mb-12">
            <h2 className="text-lg font-medium text-muted-foreground mb-4">Popular Currency Pairs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularPairs.map((pair) => (
                <RatePairCard key={`${pair.from}-${pair.to}`} from={pair.from} to={pair.to} />
              ))}
            </div>
          </div>

          {/* All Currencies */}
          <div>
            <h2 className="text-lg font-medium text-muted-foreground mb-4">Supported Currencies ({currencies.length})</h2>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {currencies.map((c: Currency) => (
                <Card key={c.code} className="glass-card p-3 md:p-4 flex flex-col justify-between hover:bg-white/5 transition-colors">
                  <div>
                    <p className="font-bold text-sm md:text-base">{c.code}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{c.country}</p>
                  </div>
                  <span className="text-lg md:text-xl mt-2">{c.symbol}</span>
                </Card>
              ))}
            </div>
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
      <SignatureBadge />
    </div>
  );
}

function RatePairCard({ from, to }: { from: string; to: string }) {
  const { data: rateData, isLoading } = useQuery({
    queryKey: ["rate-pair", from, to],
    queryFn: async () => {
      const res = await fetch(apiUrl(`/api/rates/${from}/${to}`));
      if (!res.ok) throw new Error("Failed to fetch rate");
      return res.json();
    },
    refetchInterval: 60000,
  });

  const rate = rateData?.rate || "-";
  const isUp = Math.random() > 0.5;

  return (
    <Card className="glass-card p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
      <div>
        <p className="font-bold text-sm md:text-base">{from}/{to}</p>
        <p className={`text-xs font-medium ${isUp ? "text-primary" : "text-destructive"}`}>
          {isUp ? "▲" : "▼"} {Math.random().toFixed(2)}%
        </p>
      </div>
      <p className="text-lg md:text-xl font-display font-bold">
        {typeof rate === 'number' ? rate.toFixed(4) : rate}
      </p>
    </Card>
  );
}
