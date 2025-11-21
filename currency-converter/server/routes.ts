import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

const FRANKFURTER_API = "https://api.frankfurter.dev/v1/latest";

// Fetch live rates from Frankfurter API
async function fetchLiveRate(base: string, target: string): Promise<number | null> {
  try {
    const response = await fetch(`${FRANKFURTER_API}?base=${base}&symbols=${target}`);
    if (!response.ok) return null;
    
    const data = await response.json() as any;
    return data.rates?.[target] || null;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return null;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get live exchange rate
  app.get("/api/rates/:base/:target", async (req, res) => {
    const { base, target } = req.params;
    
    // Validate currency codes (3 uppercase letters)
    if (!/^[A-Z]{3}$/.test(base) || !/^[A-Z]{3}$/.test(target)) {
      return res.status(400).json({ error: "Invalid currency code" });
    }

    try {
      const rate = await fetchLiveRate(base, target);
      
      if (rate === null) {
        return res.status(400).json({ error: "Failed to fetch exchange rate" });
      }

      // Save to storage for history
      await storage.saveRate({
        baseCurrency: base,
        targetCurrency: target,
        rate: rate.toString(),
      });

      res.json({ base, target, rate, timestamp: new Date().toISOString() });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get supported currencies - using Frankfurter API supported currencies
  app.get("/api/currencies", (req, res) => {
    const currencies = [
      { code: "AUD", name: "Australian Dollar", country: "Australia", symbol: "A$" },
      { code: "BGN", name: "Bulgarian Lev", country: "Bulgaria", symbol: "лв" },
      { code: "BRL", name: "Brazilian Real", country: "Brazil", symbol: "R$" },
      { code: "CAD", name: "Canadian Dollar", country: "Canada", symbol: "C$" },
      { code: "CHF", name: "Swiss Franc", country: "Switzerland", symbol: "Fr" },
      { code: "CNY", name: "Chinese Yuan", country: "China", symbol: "¥" },
      { code: "CZK", name: "Czech Koruna", country: "Czech Republic", symbol: "Kč" },
      { code: "DKK", name: "Danish Krone", country: "Denmark", symbol: "kr" },
      { code: "EUR", name: "Euro", country: "Eurozone", symbol: "€" },
      { code: "GBP", name: "British Pound", country: "United Kingdom", symbol: "£" },
      { code: "HUF", name: "Hungarian Forint", country: "Hungary", symbol: "Ft" },
      { code: "INR", name: "Indian Rupee", country: "India", symbol: "₹" },
      { code: "ISK", name: "Icelandic Króna", country: "Iceland", symbol: "kr" },
      { code: "JPY", name: "Japanese Yen", country: "Japan", symbol: "¥" },
      { code: "KRW", name: "South Korean Won", country: "South Korea", symbol: "₩" },
      { code: "NOK", name: "Norwegian Krone", country: "Norway", symbol: "kr" },
      { code: "NZD", name: "New Zealand Dollar", country: "New Zealand", symbol: "NZ$" },
      { code: "PLN", name: "Polish Zloty", country: "Poland", symbol: "zł" },
      { code: "RON", name: "Romanian Leu", country: "Romania", symbol: "lei" },
      { code: "SEK", name: "Swedish Krona", country: "Sweden", symbol: "kr" },
      { code: "SGD", name: "Singapore Dollar", country: "Singapore", symbol: "S$" },
      { code: "THB", name: "Thai Baht", country: "Thailand", symbol: "฿" },
      { code: "TRY", name: "Turkish Lira", country: "Turkey", symbol: "₺" },
      { code: "USD", name: "US Dollar", country: "United States", symbol: "$" },
      { code: "ZAR", name: "South African Rand", country: "South Africa", symbol: "R" },
    ];
    res.json(currencies);
  });

  const httpServer = createServer(app);
  return httpServer;
}
