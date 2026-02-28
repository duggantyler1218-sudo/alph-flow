import type { MarketTick, SignalResult, SignalDirection } from './types';

function computeEMA(closes: number[], period: number): number {
  if (closes.length < period) return closes[closes.length - 1] ?? 0;
  const k = 2 / (period + 1);
  let ema = closes.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < closes.length; i++) {
    ema = closes[i] * k + ema * (1 - k);
  }
  return ema;
}

function computeSMA(closes: number[], period: number): number {
  const slice = closes.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / slice.length;
}

function computeRSI(closes: number[], period = 14): number {
  if (closes.length < period + 1) return 50;
  let gains = 0;
  let losses = 0;
  for (let i = closes.length - period; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff > 0) gains += diff;
    else losses += Math.abs(diff);
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

export function computeSignal(tick: MarketTick): SignalResult {
  const { closes } = tick;

  const rsi = computeRSI(closes);
  const ema9 = computeEMA(closes, 9);
  const ema21 = computeEMA(closes, 21);
  const sma20 = computeSMA(closes, 20);
  const price = tick.price;

  let longVotes = 0;
  let shortVotes = 0;
  const reasons: string[] = [];

  // RSI (weight 2)
  if (rsi < 35) { longVotes += 2; reasons.push(`RSI oversold (${rsi.toFixed(0)})`); }
  else if (rsi > 65) { shortVotes += 2; reasons.push(`RSI overbought (${rsi.toFixed(0)})`); }
  else { reasons.push(`RSI neutral (${rsi.toFixed(0)})`); }

  // EMA crossover (weight 3)
  if (ema9 > ema21 * 1.001) { longVotes += 3; reasons.push('EMA9 > EMA21'); }
  else if (ema9 < ema21 * 0.999) { shortVotes += 3; reasons.push('EMA9 < EMA21'); }

  // Price vs SMA20 (weight 2)
  if (price > sma20 * 1.005) { longVotes += 2; reasons.push('Above SMA20'); }
  else if (price < sma20 * 0.995) { shortVotes += 2; reasons.push('Below SMA20'); }

  // 24h momentum (weight 1)
  if (tick.change24h > 2) { longVotes += 1; }
  else if (tick.change24h < -2) { shortVotes += 1; }

  const net = longVotes - shortVotes;
  let signal: SignalDirection;
  let rawConf: number;

  if (Math.abs(net) <= 1) {
    signal = 'HOLD';
    rawConf = 52 + Math.abs(net) * 4;
  } else if (net > 0) {
    signal = 'LONG';
    rawConf = 55 + (longVotes / 8) * 42;
  } else {
    signal = 'SHORT';
    rawConf = 55 + (shortVotes / 8) * 42;
  }

  const confidence = Math.min(96, Math.round(rawConf));
  const trend = ema9 > ema21 ? 'bullish' : ema9 < ema21 ? 'bearish' : 'neutral';

  return {
    symbol: tick.symbol,
    displayName: tick.displayName,
    category: tick.category,
    price: tick.price,
    change24h: tick.change24h,
    signal,
    confidence,
    rsi: parseFloat(rsi.toFixed(1)),
    ema9: parseFloat(ema9.toFixed(4)),
    ema21: parseFloat(ema21.toFixed(4)),
    trend,
    reason: reasons.slice(0, 2).join(' · '),
    generatedAt: Date.now(),
  };
}
