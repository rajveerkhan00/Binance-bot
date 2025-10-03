// WebSocket-only Binance service for browser compatibility
export class BinanceWebSocketService {
  private static instance: BinanceWebSocketService;
  private priceCache = new Map<string, number>();
  private subscribers = new Map<string, ((price: number) => void)[]>();
  private wsConnections = new Map<string, WebSocket>();
  private baseUrl = 'wss://stream.binance.com:9443/ws';

  private constructor() {}

  static getInstance(): BinanceWebSocketService {
    if (!BinanceWebSocketService.instance) {
      BinanceWebSocketService.instance = new BinanceWebSocketService();
    }
    return BinanceWebSocketService.instance;
  }

  // WebSocket price streaming
  subscribeToPrice(symbol: string, callback: (price: number) => void) {
    const cleanSymbol = symbol.replace('/', '').toLowerCase();
    
    if (!this.subscribers.has(cleanSymbol)) {
      this.subscribers.set(cleanSymbol, []);
    }
    this.subscribers.get(cleanSymbol)!.push(callback);

    // Initialize WebSocket if first subscriber
    if (this.subscribers.get(cleanSymbol)!.length === 1) {
      this.initializeWebSocket(cleanSymbol);
    }

    return () => {
      this.unsubscribeFromPrice(cleanSymbol, callback);
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
        this.closeWebSocket(symbol);
      }
    }
  }

  private initializeWebSocket(symbol: string) {
    try {
      const ws = new WebSocket(`${this.baseUrl}/${symbol}@ticker`);
      
      ws.onopen = () => {
        console.log(`WebSocket connected for ${symbol}`);
        this.wsConnections.set(symbol, ws);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.c) { // current price
            const price = parseFloat(data.c);
            this.priceCache.set(symbol, price);
            
            const subscribers = this.subscribers.get(symbol);
            if (subscribers) {
              subscribers.forEach(callback => callback(price));
            }
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error(`WebSocket error for ${symbol}:`, error);
      };

      ws.onclose = () => {
        console.log(`WebSocket closed for ${symbol}`);
        this.wsConnections.delete(symbol);
        
        // Attempt reconnect after 5 seconds
        setTimeout(() => {
          if (this.subscribers.has(symbol) && this.subscribers.get(symbol)!.length > 0) {
            this.initializeWebSocket(symbol);
          }
        }, 5000);
      };

    } catch (error) {
      console.error(`Error initializing WebSocket for ${symbol}:`, error);
    }
  }

  private closeWebSocket(symbol: string) {
    const ws = this.wsConnections.get(symbol);
    if (ws) {
      ws.close();
      this.wsConnections.delete(symbol);
    }
  }

  getCachedPrice(symbol: string): number {
    const cleanSymbol = symbol.replace('/', '').toLowerCase();
    return this.priceCache.get(cleanSymbol) || 0;
  }

  // Get all active symbols
  getActiveSymbols(): string[] {
    return Array.from(this.subscribers.keys());
  }

  // Close all connections
  disconnectAll() {
    this.wsConnections.forEach((ws, symbol) => {
      ws.close();
    });
    this.wsConnections.clear();
    this.subscribers.clear();
  }
}

export default BinanceWebSocketService.getInstance();