// Server-side only Binance service (for API routes or server components)
import Binance from 'binance-api-node';

const client = Binance({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_API_SECRET,
});

export class BinanceServerService {
  private static instance: BinanceServerService;
  private client = client;

  private constructor() {}

  static getInstance(): BinanceServerService {
    if (!BinanceServerService.instance) {
      BinanceServerService.instance = new BinanceServerService();
    }
    return BinanceServerService.instance;
  }

  async getPrice(symbol: string): Promise<number> {
    try {
      const ticker = await this.client.prices({ symbol });
      return parseFloat(ticker[symbol]);
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      return 0;
    }
  }

  async getAllPrices(): Promise<{ [key: string]: string }> {
    try {
      return await this.client.prices();
    } catch (error) {
      console.error('Error fetching all prices:', error);
      return {};
    }
  }

  async getKlines(symbol: string, interval: string, limit: number = 100) {
    try {
      const klines = await this.client.candles({
        symbol: symbol.replace('/', '').toUpperCase(),
        interval: interval as any,
        limit
      });
      
      return klines.map(k => ({
        open: parseFloat(k.open),
        high: parseFloat(k.high),
        low: parseFloat(k.low),
        close: parseFloat(k.close),
        volume: parseFloat(k.volume),
        time: k.openTime
      }));
    } catch (error) {
      console.error(`Error fetching klines for ${symbol}:`, error);
      return [];
    }
  }

  async getExchangeInfo() {
    try {
      return await this.client.exchangeInfo();
    } catch (error) {
      console.error('Error fetching exchange info:', error);
      return null;
    }
  }

  async get24hrStats(symbol: string) {
    try {
      return await this.client.dailyStats({ symbol });
    } catch (error) {
      console.error(`Error fetching 24hr stats for ${symbol}:`, error);
      return null;
    }
  }
}

export default BinanceServerService.getInstance();