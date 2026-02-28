export type SignalDirection = 'LONG' | 'SHORT' | 'HOLD';

export interface MarketTick {
  symbol: string;
  displayName: string;
  category: 'crypto' | 'equity' | 'futures';
  price: number;
  change24h: number;
  closes: number[];   // last 30 daily closes for indicator calculation
}

export interface SignalResult {
  symbol: string;
  displayName: string;
  category: 'crypto' | 'equity' | 'futures';
  price: number;
  change24h: number;
  signal: SignalDirection;
  confidence: number;
  rsi: number;
  ema9: number;
  ema21: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  reason: string;
  generatedAt: number;
}

export interface SignalsResponse {
  signals: SignalResult[];
  generatedAt: number;
}
