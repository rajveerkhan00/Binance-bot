// app/api/binance/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Binance from 'binance-api-node';

const client = Binance({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_API_SECRET,
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const symbol = searchParams.get('symbol') || 'BTCUSDT';
  const cleanSymbol = symbol.replace('/', '').toUpperCase();

  try {
    let data;

    switch (action) {
      case 'price': {
        const ticker = await client.prices({ symbol: cleanSymbol });
        data = { price: parseFloat(ticker[cleanSymbol]) };
        break;
      }

      case 'klines': {
        const interval = searchParams.get('interval') || '1m';
        const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10), 1000);
        const klines = await client.candles({
          symbol: cleanSymbol,
          interval: interval as any,
          limit,
        });
        data = klines.map(k => ({
          open: parseFloat(k.open),
          high: parseFloat(k.high),
          low: parseFloat(k.low),
          close: parseFloat(k.close),
          volume: parseFloat(k.volume),
          time: k.openTime,
        }));
        break;
      }

      case 'all-prices': {
        data = await client.prices();
        break;
      }

      case '24hr': {
        data = await client.dailyStats({ symbol: cleanSymbol });
        break;
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Binance API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch Binance data' },
      { status: 500 }
    );
  }
}