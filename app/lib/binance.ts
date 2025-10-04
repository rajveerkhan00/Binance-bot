export interface BinanceSymbol {
  symbol: string;
  status: string;
  baseAsset: string;
  quoteAsset: string;
}

export class BinanceAPI {
  static async getExchangeInfo(): Promise<{ symbols: BinanceSymbol[] }> {
    try {
      const response = await fetch('https://api.binance.com/api/v3/exchangeInfo');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch exchange info:', error);
      throw error;
    }
  }

  static async get24hrTicker(symbol: string): Promise<Record<string, unknown>> {
    try {
      const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Failed to fetch 24hr ticker for ${symbol}:`, error);
      throw error;
    }
  }

  static async getKlines(symbol: string, interval: string = '1m', limit: number = 100): Promise<unknown[]> {
    try {
      const response = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Failed to fetch klines for ${symbol}:`, error);
      throw error;
    }
  }
}