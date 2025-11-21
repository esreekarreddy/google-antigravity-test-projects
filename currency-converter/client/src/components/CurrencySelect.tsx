import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Currency {
  code: string;
  name: string;
  country: string;
  symbol: string;
}

interface CurrencySelectProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
}

export default function CurrencySelect({ value, onChange, label = "Select Currency" }: CurrencySelectProps) {
  const [open, setOpen] = useState(false);

  const { data: currencies = [] } = useQuery<Currency[]>({
    queryKey: ["currencies"],
    queryFn: async () => {
      const res = await fetch("/api/currencies");
      return res.json();
    },
  });

  const selectedCurrency = currencies.find((c) => c.code === value);

  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-xs md:text-sm font-medium text-muted-foreground">
          {label}
        </label>
      )}
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="glass-input h-10 md:h-14 text-xs md:text-base w-full justify-between px-4"
            data-testid="select-currency-trigger"
          >
            <span className="truncate flex-1 text-left">
              {selectedCurrency ? (
                <>
                  <span className="md:hidden">{selectedCurrency.code}</span>
                  <span className="hidden md:inline">{selectedCurrency.code} - {selectedCurrency.country}</span>
                </>
              ) : (
                "Select currency..."
              )}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
          <Command>
            <CommandInput placeholder="Search currency..." />
            <CommandList>
              <CommandEmpty>No currency found.</CommandEmpty>
              <CommandGroup>
                {currencies.map((currency) => (
                  <CommandItem
                    key={currency.code}
                    value={`${currency.code} ${currency.country} ${currency.name}`}
                    onSelect={() => {
                      onChange(currency.code);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === currency.code ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{currency.code}</span>
                      <span className="text-xs text-muted-foreground">{currency.country}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
