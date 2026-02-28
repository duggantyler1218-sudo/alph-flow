import type { MarketTick } from './types';

const CRYPTO_IDS: { id: string; symbol: string; displayName: string }[] = [
  { id: 'bitcoin',  symbol: 'BTC',  displayName: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH',  displayName: 'Ethereum' },
  { id: 'solana',   symbol: 'SOL',  displayName: 'Solana' },
];

const STOCK_SYMBOLS: { symbol: string; displayName: string; category: 'equity' | 'futures' }[] = [
  { symbol: 'SPY',  displayName: 'S&P 500 ETF',  category: 'equity' },
  { symbol: 'QQQ',  displayName: 'Nasdaq ETF',    category: 'equity' },
  { symbol: 'AAPL', displayName: 'Apple',          category: 'equity' },
  { symbol: 'NVDA', displayName: 'NVIDIA',          category: 'equity' },
  { symbol: 'TSLA', displayName: 'Tesla',           category: 'equity' },
  { symbol: 'ES=F', displayName: 'S&P 500 Futures', category: 'futures' },
  { symbol: 'NQ=F', displayName: 'Nasdaq Futures',  category: 'futures' },
];

export async function fetchCrypto(): Promise<MarketTick[]> {
  const results: MarketTick[] = [];

  // Fetch current prices + 24h change
  let prices: Record<string, { usd: number; usd_24h_change: number }> = {};
  try {
    const ids = CRYPTO_IDS.map(c => c.id).join(',');
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
      { next: { revalidate: 20 } }
    );
    if (res.ok) prices = await res.json();
  } catch { /* ignore */ }

  // Fetch historical closes for each coin
  await Promise.allSettled(
    CRYPTO_IDS.map(async ({ id, symbol, displayName }) => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=30&interval=daily`,
          { next: { revalidate: 180 } }
        );
        if (!res.ok) return;
        const data = await res.json();
        const closes: number[] = (data.prices ?? []).map(([, p]: [number, number]) => p);
        if (closes.length < 5) return;

        const priceData = prices[id];
        results.push({
          symbol,
          displayName,
          category: 'crypto',
          price: priceData?.usd ?? closes[closes.length - 1],
          change24h: priceData?.usd_24h_change ?? 0,
          closes,
        });
      } catch { /* skip this coin */ }
    })
  );

  return results;
}

export async function fetchStocks(): Promise<MarketTick[]> {
  const results: MarketTick[] = [];

  await Promise.allSettled(
    STOCK_SYMBOLS.map(async ({ symbol, displayName, category }) => {
      try {
        const res = await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=35d`,
          {
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; AlphaFlow/1.0)',
              Accept: 'application/json',
            },
            next: { revalidate: 60 },
          }
        );
        if (!res.ok) return;
        const data = await res.json();
        const result = data?.chart?.result?.[0];
        if (!result) return;

        const meta = result.meta ?? {};
        const quote = result.indicators?.quote?.[0] ?? {};
        const rawCloses: (number | null)[] = quote.close ?? [];
        const closes = rawCloses.filter((c): c is number => c !== null && !isNaN(c));
        if (closes.length < 5) return;

        const price = meta.regularMarketPrice ?? closes[closes.length - 1];
        const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? closes[closes.length - 2];
        const change24h = prevClose ? ((price - prevClose) / prevClose) * 100 : 0;

        results.push({ symbol, displayName, category, price, change24h, closes });
      } catch { /* skip this symbol */ }
    })
  );

  return results;
}
