import { NextRequest, NextResponse } from 'next/server';

interface BinanceResponse {
  symbols?: Array<{
    symbol: string;
    status: string;
    baseAsset: string;
    quoteAsset: string;
  }>;
  [key: string]: unknown;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const symbol = searchParams.get('symbol');
  const symbols = searchParams.get('symbols');
  const interval = searchParams.get('interval') || '1m';
  const limit = searchParams.get('limit') || '100';

  try {
    switch (action) {
      case 'exchange-info': {
        const response = await fetch('https://api.binance.com/api/v3/exchangeInfo');
        const data: BinanceResponse = await response.json();
        
        return NextResponse.json(data);
      }

      case '24hr': {
        if (!symbol) {
          return NextResponse.json({ error: 'Symbol parameter is required' }, { status: 400 });
        }

        const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
        const data = await response.json();
        
        return NextResponse.json(data);
      }

      case '24hr-multi': {
        if (!symbols) {
          return NextResponse.json({ error: 'Symbols parameter is required' }, { status: 400 });
        }

        const symbolList = symbols.split(',');
        const results = [];

        for (const sym of symbolList) {
          try {
            const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${sym}`);
            const data = await response.json();
            results.push(data);
          } catch (error) {
            console.error(`Failed to fetch data for ${sym}:`, error);
            // Continue with other symbols
          }
        }

        return NextResponse.json(results);
      }

      case 'klines': {
        if (!symbol) {
          return NextResponse.json({ error: 'Symbol parameter is required' }, { status: 400 });
        }

        const response = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
        );
        const data = await response.json();
        
        return NextResponse.json(data);
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Binance API error:', error);
    return NextResponse.json({ error: 'Failed to fetch data from Binance' }, { status: 500 });
  }
}