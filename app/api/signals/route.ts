import { NextResponse } from 'next/server';
import { fetchCrypto, fetchStocks } from '@/lib/market/fetchers';
import { computeSignal } from '@/lib/market/signals';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [cryptoResult, stockResult] = await Promise.allSettled([
      fetchCrypto(),
      fetchStocks(),
    ]);

    const ticks = [
      ...(cryptoResult.status === 'fulfilled' ? cryptoResult.value : []),
      ...(stockResult.status === 'fulfilled' ? stockResult.value : []),
    ];

    const signals = ticks.map(computeSignal);

    // Sort: crypto first, then equity, then futures
    const order = { crypto: 0, equity: 1, futures: 2 };
    signals.sort((a, b) => order[a.category] - order[b.category]);

    return NextResponse.json(
      { signals, generatedAt: Date.now() },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err) {
    return NextResponse.json({ error: String(err), signals: [] }, { status: 500 });
  }
}
