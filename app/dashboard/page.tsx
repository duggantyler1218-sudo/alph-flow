'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { SignalResult, SignalsResponse, SignalDirection } from '@/lib/market/types';

const REFRESH = 20;

const SIG: Record<SignalDirection, { label: string; badge: string; bar: string; border: string }> = {
  LONG:  { label: 'LONG',  badge: 'bg-green-500/15 text-green-400 border border-green-500/30', bar: 'bg-green-500',  border: 'border-green-500/20' },
  SHORT: { label: 'SHORT', badge: 'bg-red-500/15   text-red-400   border border-red-500/30',   bar: 'bg-red-500',    border: 'border-red-500/20'  },
  HOLD:  { label: 'HOLD',  badge: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20', bar: 'bg-yellow-400', border: 'border-zinc-800'    },
};

const CAT_LABEL: Record<string, string> = {
  crypto: 'Crypto',
  equity: 'Equities',
  futures: 'Futures',
};

function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
  if (price >= 1)    return price.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
  return price.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 4 });
}

function CountdownRing({ seconds, total }: { seconds: number; total: number }) {
  const r = 16;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - seconds / total);
  return (
    <div className="relative flex h-10 w-10 items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r={r} fill="none" stroke="#27272a" strokeWidth="3" />
        <circle cx="20" cy="20" r={r} fill="none" stroke="#22d3ee" strokeWidth="3"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.9s linear' }} />
      </svg>
      <span className="font-mono text-xs font-bold text-zinc-300">{seconds}</span>
    </div>
  );
}

function SignalCard({ s }: { s: SignalResult }) {
  const st = SIG[s.signal];
  const changeColor = s.change24h >= 0 ? 'text-green-400' : 'text-red-400';
  return (
    <div className={`rounded-2xl border bg-zinc-900 p-5 transition-all hover:bg-zinc-800/80 ${st.border}`}>
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-base font-extrabold text-zinc-50">{s.symbol}</p>
          <p className="text-xs text-zinc-500">{s.displayName}</p>
        </div>
        <span className={`rounded-lg px-2.5 py-1 text-xs font-bold tracking-wider ${st.badge}`}>
          {st.label}
        </span>
      </div>

      {/* Price */}
      <div className="mt-3 flex items-end gap-2">
        <span className="text-xl font-extrabold text-zinc-50">{formatPrice(s.price)}</span>
        <span className={`mb-0.5 text-sm font-semibold ${changeColor}`}>
          {s.change24h >= 0 ? '+' : ''}{s.change24h.toFixed(2)}%
        </span>
      </div>

      {/* Confidence bar */}
      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-xs text-zinc-500">
          <span>Confidence</span>
          <span className="font-semibold text-zinc-300">{s.confidence}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
          <div className={`h-full rounded-full ${st.bar} opacity-80 transition-all duration-500`}
            style={{ width: `${s.confidence}%` }} />
        </div>
      </div>

      {/* Indicators */}
      <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500">
        <span>RSI <span className={`font-semibold ${s.rsi < 35 ? 'text-green-400' : s.rsi > 65 ? 'text-red-400' : 'text-zinc-300'}`}>{s.rsi}</span></span>
        <span className="text-zinc-700">·</span>
        <span>Trend <span className={`font-semibold ${s.trend === 'bullish' ? 'text-green-400' : s.trend === 'bearish' ? 'text-red-400' : 'text-zinc-400'}`}>{s.trend}</span></span>
        <span className="ml-auto rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
          {CAT_LABEL[s.category]}
        </span>
      </div>

      {/* Reason */}
      {s.reason && (
        <p className="mt-2 text-xs text-zinc-600 leading-snug">{s.reason}</p>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="h-44 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900" />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<SignalsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(REFRESH);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'crypto' | 'equity' | 'futures'>('all');

  const fetchSignals = useCallback(async () => {
    try {
      const res = await fetch('/api/signals');
      const json: SignalsResponse & { error?: string } = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
      setError(null);
      setCountdown(REFRESH);
      setUpdatedAt(new Date().toLocaleTimeString());
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSignals(); }, [fetchSignals]);

  // Polling
  useEffect(() => {
    const id = setInterval(fetchSignals, REFRESH * 1000);
    return () => clearInterval(id);
  }, [fetchSignals]);

  // Countdown
  const countRef = useRef(countdown);
  countRef.current = countdown;
  useEffect(() => {
    const id = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const filtered = data?.signals.filter(s => filter === 'all' || s.category === filter) ?? [];

  const counts = {
    long:  data?.signals.filter(s => s.signal === 'LONG').length  ?? 0,
    short: data?.signals.filter(s => s.signal === 'SHORT').length ?? 0,
    hold:  data?.signals.filter(s => s.signal === 'HOLD').length  ?? 0,
  };

  return (
    <main className="min-h-screen bg-zinc-950 pt-20">
      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* Header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-zinc-50">Live Market Signals</h1>
            <p className="mt-1 text-sm text-zinc-500">
              {updatedAt ? `Updated ${updatedAt} · Auto-refresh every ${REFRESH}s` : 'Fetching live signals...'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <CountdownRing seconds={countdown} total={REFRESH} />
            <div className="flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">Live</span>
            </div>
          </div>
        </div>

        {/* Market sentiment bar */}
        {data && (
          <div className="mb-6 flex flex-wrap gap-3">
            {[
              { label: 'Bullish', count: counts.long,  color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
              { label: 'Bearish', count: counts.short, color: 'text-red-400',   bg: 'bg-red-500/10   border-red-500/20'   },
              { label: 'Neutral', count: counts.hold,  color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
            ].map(({ label, count, color, bg }) => (
              <div key={label} className={`flex items-center gap-2 rounded-xl border px-4 py-2 ${bg}`}>
                <span className={`text-lg font-extrabold ${color}`}>{count}</span>
                <span className="text-xs text-zinc-400">{label}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 rounded-xl border border-zinc-800 px-4 py-2">
              <span className="text-lg font-extrabold text-zinc-50">{data.signals.length}</span>
              <span className="text-xs text-zinc-400">Total</span>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex gap-2">
          {(['all', 'crypto', 'equity', 'futures'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize transition-colors ${
                filter === f
                  ? 'bg-cyan-500 text-black'
                  : 'border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
              }`}
            >
              {f === 'all' ? 'All Markets' : CAT_LABEL[f]}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            Failed to load signals: {error}
          </div>
        )}

        {/* Signals grid */}
        {loading && !data ? (
          <Skeleton />
        ) : filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map(s => <SignalCard key={s.symbol} s={s} />)}
          </div>
        ) : (
          <p className="text-center text-zinc-500 py-20">No signals found.</p>
        )}

        {/* Footer CTA */}
        <div className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 text-center">
          <p className="text-sm text-zinc-400 mb-3">
            Want AI explanations for every signal? Ask the assistant or open the discipline coach.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/chat"
              className="rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-bold text-black transition-colors hover:bg-cyan-400">
              Ask the AI Assistant
            </Link>
            <Link href="/coach"
              className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-50">
              🧠 Open Coach
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-700">
          Signals are algorithmic and for informational purposes only. Not financial advice.
          Data sourced from public market feeds.
        </p>
      </div>
    </main>
  );
}
