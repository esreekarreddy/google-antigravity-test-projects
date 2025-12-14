import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRightLeft, RefreshCw, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import CurrencySelect from "@/components/CurrencySelect";

interface CurrencyConverterProps {
  amount: number;
  setAmount: (val: number) => void;
  from: string;
  setFrom: (val: string) => void;
  to: string;
  setTo: (val: string) => void;
  rate: number | null;
  isLoading: boolean;
}

export default function CurrencyConverter({ 
  amount, setAmount, from, setFrom, to, setTo, rate, isLoading
}: CurrencyConverterProps) {
  
  const { data: currencies = [] } = useQuery({
    queryKey: ["currencies"],
    queryFn: async () => {
      const res = await fetch("/api/currencies");
      return res.json();
    },
  });

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const fromCurrency = currencies.find((c: any) => c.code === from);
  const toCurrency = currencies.find((c: any) => c.code === to);
  const convertedAmount = rate !== null ? (amount * rate).toFixed(2) : "0.00";

  return (
    <Card className="glass-card p-4 md:p-8 relative">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <TrendingUp size={80} className="md:w-[120px] md:h-[120px]" />
      </div>

      <div className="space-y-4 md:space-y-6 relative z-10">
        <div className="space-y-2">
          <label className="text-xs md:text-sm font-medium text-muted-foreground">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg md:text-xl text-muted-foreground font-display">
              {fromCurrency?.symbol}
            </span>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="glass-input pl-12 h-12 md:h-16 text-xl md:text-2xl font-display font-semibold"
              data-testid="input-amount"
            />
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] gap-2 md:gap-4 items-end">
          <CurrencySelect 
            value={from}
            onChange={setFrom}
            label="From"
          />

          <Button 
            size="icon" 
            variant="ghost" 
            className="rounded-full h-10 w-10 md:h-12 md:w-12 hover:bg-primary/20 hover:text-primary transition-colors shrink-0"
            onClick={handleSwap}
            data-testid="button-swap"
          >
            <ArrowRightLeft className="h-4 w-4 md:h-5 md:w-5" />
          </Button>

          <CurrencySelect 
            value={to}
            onChange={setTo}
            label="To"
          />
        </div>

        <div className="pt-6 md:pt-8 pb-2">
          <div className="flex flex-col items-center justify-center space-y-2">
            {isLoading ? (
              <Skeleton className="h-16 md:h-20 w-40 md:w-48" />
            ) : (
              <motion.div 
                key={convertedAmount}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-3xl sm:text-4xl md:text-6xl font-display font-bold text-gradient-primary tracking-tight text-center"
              >
                {toCurrency?.symbol} {convertedAmount}
              </motion.div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-xs md:text-sm">
                {rate !== null ? `1 ${from} = ${rate.toFixed(4)} ${to}` : "Loading rates..."}
              </span>
              <RefreshCw className="h-3 w-3 animate-spin-slow" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
