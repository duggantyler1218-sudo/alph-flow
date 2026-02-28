import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alpha Flow — AI-Powered Trading Signals',
  description:
    'Institutional-grade AI trade signals, multi-market analysis, and risk management. Trusted by 2,400+ traders worldwide.',
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-32 pb-24">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[600px] w-[800px] rounded-full bg-cyan-500/5 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
              Live AI signals
            </span>
          </div>

          {/* Headline */}
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold leading-[1.1] tracking-tight text-zinc-50 sm:text-6xl lg:text-7xl">
            Trade Smarter with{' '}
            <span className="gradient-text">AI-Powered</span>{' '}
            Signals
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-zinc-400">
            Alpha Flow delivers institutional-grade trade signals, real-time multi-market
            analysis, and intelligent risk management — so you can focus on execution,
            not research.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/store"
              className="flex items-center gap-2 rounded-xl bg-cyan-500 px-8 py-4 text-base font-bold text-black transition-all hover:bg-cyan-400 active:scale-[0.98]"
            >
              Start Your Free Trial
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/chat"
              className="flex items-center gap-2 rounded-xl border border-zinc-700 px-8 py-4 text-base font-semibold text-zinc-300 transition-all hover:border-zinc-500 hover:text-zinc-50"
            >
              Open Dashboard
            </Link>
          </div>

          {/* Social proof micro */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
            <span>✓ 30-day money-back guarantee</span>
            <span>✓ Cancel anytime</span>
            <span>✓ Trusted by 2,400+ traders</span>
          </div>
        </div>

        {/* Demo terminal */}
        <div className="relative mx-auto mt-20 max-w-3xl px-6">
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl">
            {/* Terminal bar */}
            <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-950 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-500/70" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
              <span className="h-3 w-3 rounded-full bg-green-500/70" />
              <span className="ml-auto text-xs text-zinc-600">alpha-flow · live</span>
            </div>
            {/* Signal rows */}
            <div className="divide-y divide-zinc-800/50 px-6 py-2">
              {[
                { time: '14:32:07', pair: 'BTC/USD', signal: 'LONG', conf: 91, color: 'text-green-400', bg: 'bg-green-500' },
                { time: '14:31:44', pair: 'ETH/USD', signal: 'LONG', conf: 85, color: 'text-green-400', bg: 'bg-green-500' },
                { time: '14:30:19', pair: 'SPY', signal: 'HOLD', conf: 74, color: 'text-yellow-400', bg: 'bg-yellow-400' },
                { time: '14:29:55', pair: 'AAPL', signal: 'SHORT', conf: 79, color: 'text-red-400', bg: 'bg-red-400' },
                { time: '14:28:33', pair: 'EUR/USD', signal: 'LONG', conf: 88, color: 'text-green-400', bg: 'bg-green-500' },
              ].map(({ time, pair, signal, conf, color, bg }) => (
                <div key={time} className="flex items-center gap-4 py-3 text-sm">
                  <span className="font-mono text-xs text-zinc-600">{time}</span>
                  <span className="w-20 font-semibold text-zinc-200">{pair}</span>
                  <span className={`w-14 font-bold ${color}`}>{signal}</span>
                  <div className="flex flex-1 items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className={`h-full rounded-full ${bg} opacity-80 transition-all`}
                        style={{ width: `${conf}%` }}
                      />
                    </div>
                    <span className="text-xs text-zinc-500">{conf}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-zinc-600">
            Simulated signals for illustration only — not financial advice
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-zinc-800 bg-zinc-900/30 py-12">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
          {[
            { value: '2,400+', label: 'Active traders' },
            { value: '94%', label: 'Signal accuracy' },
            { value: '12ms', label: 'Signal latency' },
            { value: '24/7', label: 'Market coverage' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-extrabold tracking-tight text-zinc-50">{value}</p>
              <p className="mt-1 text-sm text-zinc-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-50 sm:text-4xl">
            Everything you need to trade with confidence
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-zinc-400">
            Powered by large language models and technical analysis engines running
            across global markets in real time.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              ),
              title: 'Real-Time Signals',
              desc: 'Sub-20ms signal generation across crypto, equities, and forex — faster than any human analyst.',
            },
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                </svg>
              ),
              title: 'Multi-Timeframe Analysis',
              desc: 'Simultaneous analysis from 1-minute scalps to monthly macro trends, all synthesized into a single signal.',
            },
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              ),
              title: 'Risk Management',
              desc: 'Automatic position sizing, stop-loss suggestions, and drawdown alerts to protect your capital.',
            },
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 2.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125m0 3.75c0 2.278 3.694 4.125 8.25 4.125s8.25-1.847 8.25-4.125" />
                </svg>
              ),
              title: 'Portfolio Intelligence',
              desc: 'AI-driven portfolio rebalancing recommendations based on correlation analysis and market regime detection.',
            },
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                </svg>
              ),
              title: 'AI Chat Assistant',
              desc: 'Ask Alpha Flow anything — get plain-English explanations for every signal, position, or market event.',
            },
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              ),
              title: 'Instant Alerts',
              desc: 'Push notifications the moment a high-confidence signal fires, so you never miss a setup.',
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all duration-300 hover:border-cyan-500/30 hover:bg-zinc-900"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 transition-colors group-hover:bg-cyan-500/20">
                {icon}
              </div>
              <h3 className="mb-2 font-semibold text-zinc-100">{title}</h3>
              <p className="text-sm leading-relaxed text-zinc-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing preview ── */}
      <section className="bg-zinc-900/40 py-24">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-zinc-50 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mb-10 text-zinc-400">No hidden fees. Cancel anytime.</p>

          <div className="mx-auto flex max-w-lg flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
            <Link
              href="/store"
              className="flex-1 rounded-xl border border-zinc-700 px-6 py-4 text-center transition-all hover:border-zinc-500"
            >
              <p className="text-xs uppercase tracking-widest text-zinc-500">Monthly</p>
              <p className="mt-1 text-3xl font-extrabold text-zinc-50">From</p>
              <p className="mt-1 text-sm text-zinc-400">Flexible month-to-month</p>
            </Link>

            <Link
              href="/store"
              className="flex-1 rounded-xl border border-cyan-500/50 bg-zinc-900 px-6 py-4 text-center shadow-[0_0_30px_rgba(6,182,212,0.1)] transition-all hover:border-cyan-400/70"
            >
              <div className="mb-1 flex justify-center">
                <span className="rounded-full bg-cyan-500 px-2 py-0.5 text-[10px] font-bold uppercase text-black">
                  Best Value
                </span>
              </div>
              <p className="text-xs uppercase tracking-widest text-cyan-400">Yearly</p>
              <p className="mt-1 text-3xl font-extrabold text-zinc-50">Save 20%+</p>
              <p className="mt-1 text-sm text-zinc-400">2 months free</p>
            </Link>
          </div>

          <Link
            href="/store"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
          >
            View full pricing
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="mb-12 text-center text-3xl font-extrabold tracking-tight text-zinc-50">
          Trusted by real traders
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              quote: "Alpha Flow's signals have completely changed how I approach the market. My win rate jumped from 52% to 71% in the first month.",
              name: 'Marcus T.',
              role: 'Day trader, 8 years',
            },
            {
              quote: "The multi-timeframe analysis is incredible. I get context I never had before — not just a signal, but the why behind it.",
              name: 'Sarah K.',
              role: 'Swing trader',
            },
            {
              quote: "I was skeptical of AI trading tools but this one is different. The risk management alerts alone saved me from three bad trades last week.",
              name: 'David L.',
              role: 'Portfolio manager',
            },
          ].map(({ quote, name, role }) => (
            <div
              key={name}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6"
            >
              <div className="mb-4 flex text-cyan-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="mb-4 text-sm leading-relaxed text-zinc-300">&ldquo;{quote}&rdquo;</p>
              <div>
                <p className="text-sm font-semibold text-zinc-100">{name}</p>
                <p className="text-xs text-zinc-500">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[400px] w-[600px] rounded-full bg-cyan-500/8 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-zinc-50">
            Ready to trade smarter?
          </h2>
          <p className="mb-8 text-lg text-zinc-400">
            Join 2,400+ traders using Alpha Flow to find their edge. Start with a
            30-day money-back guarantee.
          </p>
          <Link
            href="/store"
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-10 py-4 text-base font-bold text-black transition-all hover:bg-cyan-400 active:scale-[0.98]"
          >
            Get Started Today
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-800 bg-zinc-950 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-300">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500">
                <svg className="h-3.5 w-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </span>
              Alpha Flow
            </div>
            <div className="flex gap-6 text-sm text-zinc-500">
              <Link href="/store" className="transition-colors hover:text-zinc-300">Pricing</Link>
              <Link href="/chat" className="transition-colors hover:text-zinc-300">Dashboard</Link>
              <span className="cursor-default">Privacy</span>
              <span className="cursor-default">Terms</span>
            </div>
            <p className="text-xs text-zinc-600">
              © {new Date().getFullYear()} Alpha Flow. Not financial advice.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
