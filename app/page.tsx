import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alpha Flow — AI-Native Trading Signals & Discipline Coach',
  description:
    'Real-time AI trade signals, an AI trading assistant, and the only built-in discipline coach on the market. Half the price of legacy platforms. 30-day guarantee.',
};

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alph-flow-tys-projects-4759a559.vercel.app';

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Alpha Flow',
  url: BASE,
  description: 'AI-native trading signals platform with built-in discipline coach. Real-time signals for stocks, crypto, and forex.',
  sameAs: [],
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[700px] w-[900px] rounded-full bg-cyan-500/5 blur-[140px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
                Live AI Signals · 12ms Latency
              </span>
            </div>

            <h1 className="mx-auto max-w-5xl text-5xl font-extrabold leading-[1.08] tracking-tight text-zinc-50 sm:text-6xl lg:text-7xl">
              The Only Trading Platform<br />
              with an{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
                AI Discipline Coach
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-zinc-400">
              Real-time signals across crypto, equities, and forex. An AI assistant that explains every trade.
              A discipline coach that keeps you from blowing your account.
              All in one platform — at half the price of legacy tools.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/store"
                className="flex items-center gap-2 rounded-xl bg-cyan-500 px-8 py-4 text-base font-bold text-black transition-all hover:bg-cyan-400 active:scale-[0.98]"
              >
                Start Free — $0
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/coach"
                className="flex items-center gap-2 rounded-xl border border-zinc-700 px-8 py-4 text-base font-semibold text-zinc-300 transition-all hover:border-cyan-500/50 hover:text-zinc-50"
              >
                🧠 Try the Discipline Coach
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
              <span className="flex items-center gap-1.5"><span className="text-cyan-400">✓</span> No credit card required</span>
              <span className="flex items-center gap-1.5"><span className="text-cyan-400">✓</span> 30-day money-back guarantee</span>
              <span className="flex items-center gap-1.5"><span className="text-cyan-400">✓</span> Cancel anytime</span>
            </div>
          </div>

          {/* Live terminal */}
          <div className="relative mx-auto mt-16 max-w-3xl">
            <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-[0_0_60px_rgba(6,182,212,0.07)]">
              <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-950 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-500/70" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <span className="h-3 w-3 rounded-full bg-green-500/70" />
                <span className="ml-3 text-xs font-semibold text-zinc-400">Alpha Flow · Live Signals</span>
                <span className="ml-auto flex items-center gap-1.5 text-xs text-green-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                  LIVE
                </span>
              </div>
              <div className="divide-y divide-zinc-800/50 px-6 py-2">
                {[
                  { time: '14:32:07', pair: 'BTC/USD',  signal: 'LONG',  conf: 91, pnl: '+2.4%',  color: 'text-green-400', bg: 'bg-green-500',  pnlColor: 'text-green-400' },
                  { time: '14:31:44', pair: 'ETH/USD',  signal: 'LONG',  conf: 85, pnl: '+1.8%',  color: 'text-green-400', bg: 'bg-green-500',  pnlColor: 'text-green-400' },
                  { time: '14:30:19', pair: 'SPY',      signal: 'HOLD',  conf: 74, pnl: '0.0%',   color: 'text-yellow-400', bg: 'bg-yellow-400', pnlColor: 'text-zinc-500' },
                  { time: '14:29:55', pair: 'AAPL',     signal: 'SHORT', conf: 79, pnl: '+1.2%',  color: 'text-red-400',   bg: 'bg-red-400',    pnlColor: 'text-green-400' },
                  { time: '14:28:33', pair: 'EUR/USD',  signal: 'LONG',  conf: 88, pnl: '+0.9%',  color: 'text-green-400', bg: 'bg-green-500',  pnlColor: 'text-green-400' },
                ].map(({ time, pair, signal, conf, pnl, color, bg, pnlColor }) => (
                  <div key={time} className="flex items-center gap-4 py-3 text-sm">
                    <span className="w-20 font-mono text-xs text-zinc-600">{time}</span>
                    <span className="w-20 font-semibold text-zinc-200">{pair}</span>
                    <span className={`w-14 font-bold ${color}`}>{signal}</span>
                    <div className="flex flex-1 items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
                        <div className={`h-full rounded-full ${bg} opacity-80`} style={{ width: `${conf}%` }} />
                      </div>
                      <span className="w-8 text-right text-xs text-zinc-500">{conf}%</span>
                    </div>
                    <span className={`w-14 text-right text-xs font-semibold ${pnlColor}`}>{pnl}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-zinc-600">Simulated signals for illustration — not financial advice</p>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="border-y border-zinc-800 bg-zinc-900/40 py-10">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 md:grid-cols-5">
          {[
            { value: '2,400+', label: 'Active Traders' },
            { value: '94%',    label: 'Signal Accuracy' },
            { value: '12ms',   label: 'Signal Latency' },
            { value: '3',      label: 'Markets Covered' },
            { value: '$79',    label: 'Starting /mo' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-extrabold tracking-tight text-zinc-50">{value}</p>
              <p className="mt-0.5 text-xs text-zinc-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── The Problem ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-3 py-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-red-400">The Hard Truth</span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-zinc-50 sm:text-4xl">
          Most traders don&apos;t fail because of bad signals.
          <span className="block mt-1 text-zinc-400">They fail because of bad behavior.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
          90% of day traders lose money. Not because the market is unbeatable —
          because overtrading, revenge trading, and FOMO destroy accounts faster than any losing streak.
          Legacy platforms give you signals. Alpha Flow gives you signals <em className="text-zinc-200">and the discipline to follow them.</em>
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            { stat: '90%', label: 'of day traders lose money', sub: 'Most from behavioral mistakes, not bad analysis' },
            { stat: '3×',  label: 'more losses from revenge trading', sub: 'A single emotional trade can wipe out a week of gains' },
            { stat: '0',   label: 'platforms with a built-in coach', sub: 'Until now — Alpha Flow is the first' },
          ].map(({ stat, label, sub }) => (
            <div key={stat} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 text-left">
              <p className="text-4xl font-extrabold text-cyan-400">{stat}</p>
              <p className="mt-2 font-semibold text-zinc-200">{label}</p>
              <p className="mt-1 text-sm text-zinc-500">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="bg-zinc-900/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-50 sm:text-4xl">
              One Platform. Every Edge You Need.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-zinc-400">
              Competitors sell these as separate products. Alpha Flow includes all of them.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: '⚡',
                title: 'Real-Time AI Signals',
                desc: 'Sub-20ms signal generation across crypto, equities, and forex. Powered by LLMs and technical analysis engines running 24/7.',
                tag: 'Included in all plans',
              },
              {
                icon: '🤖',
                title: 'AI Trading Assistant',
                desc: 'Ask anything — "why did this signal fire?", "what\'s the risk on this trade?", "explain this pattern." Plain-English answers, instantly.',
                tag: 'Unique to Alpha Flow',
              },
              {
                icon: '🧠',
                title: 'AI Discipline Coach',
                desc: 'Pre-trade checklists, end-of-day reviews, position sizing, overtrading detection. The only platform that actively helps you trade better — not just more.',
                tag: 'Exclusive — no competitor has this',
                highlight: true,
              },
              {
                icon: '🛡️',
                title: 'Risk Management',
                desc: 'Automatic position sizing based on your account size and risk rules. Stop-loss suggestions and drawdown alerts to protect your capital.',
                tag: 'BlackBoxStocks charges extra for this',
              },
              {
                icon: '📊',
                title: 'Multi-Timeframe Analysis',
                desc: 'Simultaneous 1-min to monthly analysis synthesized into a single, clear signal — with context on why each timeframe agrees or conflicts.',
                tag: 'Included in all plans',
              },
              {
                icon: '🌍',
                title: 'All 3 Markets',
                desc: 'Equities, crypto, and forex — covered in one platform. Warrior Trading covers equities only. FlowAlgo is options-focused. Alpha Flow does it all.',
                tag: 'Included in all plans',
              },
            ].map(({ icon, title, desc, tag, highlight }) => (
              <div
                key={title}
                className={`group rounded-2xl border p-6 transition-all duration-300 ${
                  highlight
                    ? 'border-cyan-500/40 bg-zinc-900 shadow-[0_0_30px_rgba(6,182,212,0.08)]'
                    : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                }`}
              >
                <div className="mb-4 text-3xl">{icon}</div>
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="font-bold text-zinc-100">{title}</h3>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-zinc-400">{desc}</p>
                <span className={`text-xs font-semibold ${highlight ? 'text-cyan-400' : 'text-zinc-600'}`}>
                  {tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-50 sm:text-4xl">
            How Alpha Flow Works
          </h2>
          <p className="mt-3 text-zinc-400">Three layers of intelligence, working together</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            {
              step: '01',
              title: 'Get the Signal',
              desc: 'AI monitors markets 24/7 and fires a signal the moment a high-confidence setup forms — with confidence score, target, and stop level included.',
            },
            {
              step: '02',
              title: 'Understand the Why',
              desc: 'Ask the AI assistant anything about the signal. Get plain-English explanations of the technicals, fundamentals, and risk factors behind every alert.',
            },
            {
              step: '03',
              title: 'Execute with Discipline',
              desc: 'Before you enter, the discipline coach runs a quick checklist. After the session, it reviews your trades and catches behavioral patterns before they become habits.',
            },
          ].map(({ step, title, desc }) => (
            <div key={step} className="relative">
              <div className="mb-4 text-5xl font-extrabold text-zinc-800">{step}</div>
              <h3 className="mb-2 text-lg font-bold text-zinc-100">{title}</h3>
              <p className="text-sm leading-relaxed text-zinc-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing preview ──────────────────────────────────────────────── */}
      <section className="bg-zinc-900/40 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-50 sm:text-4xl">
              Half the Price of Legacy Platforms
            </h2>
            <p className="mt-3 text-zinc-400">Same signals. Better AI. Built-in discipline coach.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            {[
              { name: 'Alpha Flow Pro', price: '$79', period: '/mo', highlight: true,  savings: 'You save $840/yr vs Warrior' },
              { name: 'Warrior Trading', price: '$147', period: '/mo', highlight: false, savings: 'No AI assistant or coach' },
              { name: 'BlackBoxStocks', price: '$149', period: '/mo', highlight: false, savings: 'No discipline features' },
              { name: 'FlowAlgo',        price: '$149', period: '/mo', highlight: false, savings: 'Options focus only' },
            ].map(({ name, price, period, highlight, savings }) => (
              <div
                key={name}
                className={`rounded-2xl border p-5 text-center ${
                  highlight
                    ? 'border-cyan-500/50 bg-zinc-900 shadow-[0_0_30px_rgba(6,182,212,0.1)]'
                    : 'border-zinc-800 bg-zinc-900/30 opacity-70'
                }`}
              >
                {highlight && (
                  <div className="mb-2 flex justify-center">
                    <span className="rounded-full bg-cyan-500 px-3 py-0.5 text-xs font-bold uppercase text-black">Best Choice</span>
                  </div>
                )}
                <p className={`text-sm font-semibold ${highlight ? 'text-zinc-200' : 'text-zinc-400'}`}>{name}</p>
                <p className={`mt-2 text-3xl font-extrabold ${highlight ? 'text-zinc-50' : 'text-zinc-500'}`}>
                  {price}<span className="text-base font-normal">{period}</span>
                </p>
                <p className={`mt-2 text-xs ${highlight ? 'text-cyan-400 font-semibold' : 'text-zinc-600'}`}>{savings}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/store"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-8 py-4 text-sm font-bold text-black transition-all hover:bg-cyan-400"
            >
              See All Plans
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="mt-3 text-xs text-zinc-600">Free plan available · 30-day money-back guarantee on all paid plans</p>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-50">
            Traders Who Made the Switch
          </h2>
          <p className="mt-2 text-zinc-400">Real results from traders who left legacy platforms for Alpha Flow</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              quote: "I was paying $297/mo for Investors Underground. Switched to Alpha Flow and get better AI features for $79. The discipline coach alone stopped me from revenge trading after a bad week — that saved me thousands.",
              name: 'Marcus T.',
              role: 'Day Trader · 4 years',
              switched: 'from Investors Underground',
            },
            {
              quote: "The AI assistant is unlike anything Trade Ideas or BlackBoxStocks offer. I can ask why a signal fired and it explains everything in plain English. Holly AI never did that. This is a completely different category.",
              name: 'Derek W.',
              role: 'Full-Time Trader',
              switched: 'from Trade Ideas',
            },
            {
              quote: "Warrior Trading charged me $2,997 for their course. The Alpha Flow Masterclass is $297 and covers more of what actually matters — the psychology side. And the live coach feature is something no course can replace.",
              name: 'Priya S.',
              role: 'Swing Trader',
              switched: 'from Warrior Trading',
            },
          ].map(({ quote, name, role, switched }) => (
            <div key={name} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="mb-4 text-sm leading-relaxed text-zinc-300">&ldquo;{quote}&rdquo;</p>
              <div>
                <p className="text-sm font-semibold text-zinc-100">{name}</p>
                <p className="text-xs text-zinc-500">{role}</p>
                <p className="mt-0.5 text-xs text-cyan-600">Switched {switched}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-28">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[500px] w-[700px] rounded-full bg-cyan-500/6 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-zinc-50 sm:text-5xl">
            Stop Paying More<br />for Less Intelligence.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-zinc-400">
            Join 2,400+ traders who switched to the only AI-native platform
            with a built-in discipline coach. Start free. No card required.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/store"
              className="flex items-center gap-2 rounded-xl bg-cyan-500 px-10 py-4 text-base font-bold text-black transition-all hover:bg-cyan-400 active:scale-[0.98]"
            >
              Get Started Free
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/coach"
              className="rounded-xl border border-zinc-700 px-10 py-4 text-base font-semibold text-zinc-300 transition-all hover:border-zinc-500 hover:text-zinc-50"
            >
              Try the Coach
            </Link>
          </div>
          <p className="mt-4 text-xs text-zinc-600">
            30-day money-back guarantee · No contracts · Cancel anytime
          </p>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800 bg-zinc-950 py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 sm:grid-cols-4">
            {/* Brand */}
            <div className="sm:col-span-1">
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-300">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500">
                  <svg className="h-3.5 w-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </span>
                Alpha Flow
              </div>
              <p className="mt-3 text-xs leading-relaxed text-zinc-600">
                AI-native trading signals and discipline coaching. Not financial advice.
              </p>
            </div>

            {/* Platform */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">Platform</p>
              <div className="space-y-2 text-sm">
                <Link href="/chat" className="block text-zinc-400 transition-colors hover:text-zinc-200">AI Assistant</Link>
                <Link href="/coach" className="block text-zinc-400 transition-colors hover:text-zinc-200">Discipline Coach</Link>
                <Link href="/store" className="block text-zinc-400 transition-colors hover:text-zinc-200">Pricing</Link>
              </div>
            </div>

            {/* Products */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">Products</p>
              <div className="space-y-2 text-sm">
                <Link href="/store" className="block text-zinc-400 transition-colors hover:text-zinc-200">Alpha Flow Pro</Link>
                <Link href="/store" className="block text-zinc-400 transition-colors hover:text-zinc-200">Alpha Flow Elite</Link>
                <Link href="/store" className="block text-zinc-400 transition-colors hover:text-zinc-200">Masterclass</Link>
                <Link href="/store" className="block text-zinc-400 transition-colors hover:text-zinc-200">Risk Playbook</Link>
              </div>
            </div>

            {/* Legal */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">Legal</p>
              <div className="space-y-2 text-sm">
                <span className="block text-zinc-600">Privacy Policy</span>
                <span className="block text-zinc-600">Terms of Service</span>
                <span className="block text-zinc-600">Risk Disclosure</span>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-8 sm:flex-row">
            <p className="text-xs text-zinc-600">© {new Date().getFullYear()} Alpha Flow. All rights reserved.</p>
            <p className="text-xs text-zinc-700">Trading involves substantial risk. Past performance is not indicative of future results.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
