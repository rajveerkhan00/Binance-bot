export interface BinanceKline {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteAssetVolume: string;
  numberOfTrades: number;
  takerBuyBaseAssetVolume: string;
  takerBuyQuoteAssetVolume: string;
  ignore: string;
}

export interface BinanceTicker {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  askPrice: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

export class BinanceServer {
  static async getKlines(symbol: string, interval: string = '1m', limit: number = 100): Promise<BinanceKline[]> {
    try {
      const response = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: unknown[] = await response.json();
      
      return data.map((item: unknown) => {
        const kline = item as unknown[];
        return {
          openTime: Number(kline[0]),
          open: String(kline[1]),
          high: String(kline[2]),
          low: String(kline[3]),
          close: String(kline[4]),
          volume: String(kline[5]),
          closeTime: Number(kline[6]),
          quoteAssetVolume: String(kline[7]),
          numberOfTrades: Number(kline[8]),
          takerBuyBaseAssetVolume: String(kline[9]),
          takerBuyQuoteAssetVolume: String(kline[10]),
          ignore: String(kline[11])
        };
      });
    } catch (error) {
      console.error('Failed to fetch klines:', error);
      throw error;
    }
  }

  static async getTicker(symbol: string): Promise<BinanceTicker> {
    try {
      const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: BinanceTicker = await response.json() as BinanceTicker;
      return data;
    } catch (error) {
      console.error('Failed to fetch ticker:', error);
      throw error;
    }
  }

  static async getExchangeInfo() {
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
}