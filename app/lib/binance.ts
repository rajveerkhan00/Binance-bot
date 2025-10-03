import Binance from 'binance-api-node';

const client = Binance({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_API_SECRET,
});

// Define proper types for WebSocket responses
interface WebSocketTicker {
  symbol: string;
  lastPrice: string;
  bestBid: string;
  bestAsk: string;
  close: string;
  open: string;
  high: string;
  low: string;
  volume: string;
  quoteVolume: string;
  eventType: string;
  eventTime: number;
  openTime: number;
  closeTime: number;
  firstTradeId: number;
  lastTradeId: number;
  totalTrades: number;
}

export class BinanceService {
  private static instance: BinanceService;
  private client = client;
  private priceCache = new Map<string, number>();
  private subscribers = new Map<string, ((price: number) => void)[]>();

  private constructor() {}

  static getInstance(): BinanceService {
    if (!BinanceService.instance) {
      BinanceService.instance = new BinanceService();
    }
    return BinanceService.instance;
  }

  async getPrice(symbol: string): Promise<number> {
    try {
      const ticker = await this.client.prices({ symbol });
      const price = parseFloat(ticker[symbol]);
      this.priceCache.set(symbol, price);
      return price;
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      return this.priceCache.get(symbol) || 0;
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

  // WebSocket price streaming
  subscribeToPrice(symbol: string, callback: (price: number) => void) {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, []);
    }
    this.subscribers.get(symbol)!.push(callback);

    // Initialize WebSocket if first subscriber
    if (this.subscribers.get(symbol)!.length === 1) {
      this.initializeWebSocket(symbol);
    }

    return () => {
      this.unsubscribeFromPrice(symbol, callback);
    };
  }

  private unsubscribeFromPrice(symbol: string, callback: (price: number) => void) {
    const subscribers = this.subscribers.get(symbol);
    if (subscribers) {
      const index = subscribers.indexOf(callback);
      if (index > -1) {
        subscribers.splice(index, 1);
      }
      if (subscribers.length === 0) {
        this.subscribers.delete(symbol);
      }
    }
  }

  private initializeWebSocket(symbol: string) {
    try {
      const cleanSymbol = symbol.replace('/', '').toUpperCase();
      
      this.client.ws.ticker(cleanSymbol, (ticker: any) => {
        // Use the correct property names from Binance WebSocket
        let price: number;
        
        // Try different possible price properties
        if (ticker.lastPrice) {
          price = parseFloat(ticker.lastPrice);
        } else if (ticker.close) {
          price = parseFloat(ticker.close);
        } else if (ticker.currentClose) {
          price = parseFloat(ticker.currentClose);
        } else if (ticker.c) {
          price = parseFloat(ticker.c);
        } else {
          console.warn('No price found in ticker:', ticker);
          return;
        }
        
        this.priceCache.set(symbol, price);
        
        const subscribers = this.subscribers.get(symbol);
        if (subscribers) {
          subscribers.forEach(callback => callback(price));
        }
      });
    } catch (error) {
      console.error(`Error initializing WebSocket for ${symbol}:`, error);
      
      // Fallback: use REST API polling if WebSocket fails
      this.startRestPolling(symbol);
    }
  }

  private startRestPolling(symbol: string) {
    const pollInterval = setInterval(async () => {
      try {
        const price = await this.getPrice(symbol);
        const subscribers = this.subscribers.get(symbol);
        if (subscribers) {
          subscribers.forEach(callback => callback(price));
        }
      } catch (error) {
        console.error(`Error polling price for ${symbol}:`, error);
      }
    }, 3000); // Poll every 3 seconds

    // Store interval for cleanup
    if (!this.subscribers.has(symbol + '_polling')) {
      this.subscribers.set(symbol + '_polling', []);
    }
    
    // Return cleanup function
    return () => {
      clearInterval(pollInterval);
      this.subscribers.delete(symbol + '_polling');
    };
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

  // Get multiple symbols at once (optimized)
  async getMultiplePrices(symbols: string[]): Promise<{ [key: string]: number }> {
    try {
      const allPrices = await this.client.prices();
      const result: { [key: string]: number } = {};
      
      symbols.forEach(symbol => {
        const cleanSymbol = symbol.replace('/', '').toUpperCase();
        if (allPrices[cleanSymbol]) {
          result[symbol] = parseFloat(allPrices[cleanSymbol]);
          this.priceCache.set(symbol, result[symbol]);
        }
      });
      
      return result;
    } catch (error) {
      console.error('Error fetching multiple prices:', error);
      
      // Return cached prices as fallback
      const result: { [key: string]: number } = {};
      symbols.forEach(symbol => {
        result[symbol] = this.priceCache.get(symbol) || 0;
      });
      return result;
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.ping();
      return true;
    } catch (error) {
      console.error('Binance API health check failed:', error);
      return false;
    }
  }

  // Get server time
  async getServerTime(): Promise<number> {
    try {
      const time = await this.client.time();
      return time;
    } catch (error) {
      console.error('Error fetching server time:', error);
      return Date.now();
    }
  }

  // Trading methods (commented out for safety - uncomment when ready to trade)
  /*
  async placeOrder(symbol: string, side: 'BUY' | 'SELL', quantity: number, price: number) {
    try {
      const order = await this.client.order({
        symbol: symbol.replace('/', '').toUpperCase(),
        side,
        quantity: quantity.toString(),
        price: price.toString(),
        type: 'LIMIT'
      });
      return order;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  }

  async getAccountInfo() {
    try {
      return await this.client.accountInfo();
    } catch (error) {
      console.error('Error fetching account info:', error);
      throw error;
    }
  }

  async getFuturesAccountInfo() {
    try {
      return await this.client.futuresAccountInfo();
    } catch (error) {
      console.error('Error fetching futures account info:', error);
      throw error;
    }
  }

  async getFuturesBalance() {
    try {
      return await this.client.futuresAccountBalance();
    } catch (error) {
      console.error('Error fetching futures balance:', error);
      throw error;
    }
  }
  */
}

export default BinanceService.getInstance();