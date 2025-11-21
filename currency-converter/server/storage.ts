import { type ExchangeRate, type ExchangeRateInsert } from "@shared/schema";

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
      id: Math.floor(Math.random() * 10000),
      ...rate,
      timestamp: new Date(),
    };
  }
}

export const storage = new MemStorage();
