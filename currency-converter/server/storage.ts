import { type ExchangeRate, type ExchangeRateInsert } from "@shared/schema";
// SECURITY: Use crypto for secure random numbers
import { randomInt } from "crypto";

export interface IStorage {
  getLatestRate(baseCurrency: string, targetCurrency: string): Promise<number | null>;
  saveRate(rate: ExchangeRateInsert): Promise<ExchangeRate>;
}

export class MemStorage implements IStorage {
  private rates: Map<string, number> = new Map();

  async getLatestRate(baseCurrency: string, targetCurrency: string): Promise<number | null> {
    const key = `${baseCurrency}:${targetCurrency}`;
    return this.rates.get(key) || null;
  }

  async saveRate(rate: ExchangeRateInsert): Promise<ExchangeRate> {
    const key = `${rate.baseCurrency}:${rate.targetCurrency}`;
    this.rates.set(key, parseFloat(rate.rate.toString()));
    return {
      // SECURITY: Generate a random ID securely instead of Math.random
      id: randomInt(1, 10001), // Generates a random integer between 1 and 10000 (inclusive)
      ...rate,
      timestamp: new Date(),
    };
  }
}

export const storage = new MemStorage();
