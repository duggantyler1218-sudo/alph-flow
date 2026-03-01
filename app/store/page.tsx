import { getProducts } from '@/lib/shopify/client';
import { ProductCard } from '@/components/store/product-card';
import type { Metadata } from 'next';
import type { ShopifyProduct } from '@/lib/shopify/types';

export const metadata: Metadata = {
  title: 'Pricing — Alpha Flow',
  description: 'AI-native trading signals, discipline coach, and risk management. Starting at $79/mo — half the price of competitors.',
};

function categorize(products: ShopifyProduct[]) {
  const subscriptions: ShopifyProduct[] = [];
  const tools: ShopifyProduct[] = [];
  const ebooks: ShopifyProduct[] = [];
  const bundles: ShopifyProduct[] = [];

  for (const p of products) {
    const h = p.handle.toLowerCase();
    if (h.includes('bundle') || h.includes('toolkit') || h.includes('complete-trader')) {
      bundles.push(p);
    } else if (h.includes('ebook')) {
      ebooks.push(p);
    } else if (
      h.includes('masterclass') || h.includes('course') ||
      h.includes('playbook') || h.includes('guide') ||
      h.includes('pdf') || h.includes('journal') ||
      h.includes('calculator') || h.includes('price-action') ||
      h.includes('gap')
    ) {
      tools.push(p);
    } else {
      subscriptions.push(p);
    }
  }

  subscriptions.sort((a, b) => {
    const order = (h: string) => {
      if (h.includes('free')) return 0;
      if (h.includes('elite') && (h.includes('yearly') || h.includes('annual'))) return 4;
      if (h.includes('elite')) return 3;
      if (h.includes('yearly') || h.includes('annual')) return 2;
      return 1;
    };
    return order(a.handle) - order(b.handle);
  });

  // Sort tools by price ascending (templates first, then guides, then course)
  tools.sort((a, b) => {
    const pa = parseFloat(a.variants.edges[0]?.node.price.amount ?? '0');
    const pb = parseFloat(b.variants.edges[0]?.node.price.amount ?? '0');
    return pa - pb;
  });

  // Sort ebooks by price ascending
  ebooks.sort((a, b) => {
    const pa = parseFloat(a.variants.edges[0]?.node.price.amount ?? '0');
    const pb = parseFloat(b.variants.edges[0]?.node.price.amount ?? '0');
    return pa - pb;
  });

  return { subscriptions, tools, ebooks, bundles };
}

const COMPARE_ROWS = [
  { feature: 'Price',               alphaflow: '$79/mo',  warrior: '$147/mo', blackbox: '$149/mo', flowalgo: '$149/mo' },
  { feature: 'AI Chat Assistant',   alphaflow: true,      warrior: false,     blackbox: false,     flowalgo: false },
  { feature: 'AI Discipline Coach', alphaflow: true,      warrior: false,     blackbox: false,     flowalgo: false },
  { feature: 'Real-Time Signals',   alphaflow: true,      warrior: true,      blackbox: true,      flowalgo: true },
  { feature: 'Risk Management',     alphaflow: true,      warrior: true,      blackbox: false,     flowalgo: false },
  { feature: 'Multi-Market',        alphaflow: true,      warrior: false,     blackbox: true,      flowalgo: false },
  { feature: 'Position Sizing',     alphaflow: true,      warrior: false,     blackbox: false,     flowalgo: false },
  { feature: 'Mobile Friendly',     alphaflow: true,      warrior: false,     blackbox: true,      flowalgo: true },
  { feature: '30-Day Guarantee',    alphaflow: true,      warrior: false,     blackbox: false,     flowalgo: false },
];

function Check({ yes }: { yes: boolean }) {
  if (yes) return (
    <svg className="mx-auto h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
  return (
    <svg className="mx-auto h-5 w-5 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default async function StorePage() {
  const products = await getProducts();
  const { subscriptions, tools, ebooks, bundles } = categorize(products);

  return (
    <div className="min-h-screen bg-zinc-950 pt-24">

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-12 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
          <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
            AI-Native Trading Platform
          </span>
        </div>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-zinc-50 sm:text-6xl">
          Half the Price.<br />
          <span className="text-cyan-400">Twice the Intelligence.</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-zinc-400">
          While competitors bolt AI onto legacy tools, Alpha Flow was built AI-native from day one.
          Real-time signals, an AI trading assistant, and a built-in discipline coach — all in one platform.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-zinc-400">
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400"/>No contracts</span>
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400"/>Cancel anytime</span>
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400"/>30-day money-back guarantee</span>
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400"/>Instant access</span>
        </div>
      </section>

      {/* ── Trust bar ───────────────────────────────────────────────────── */}
      <div className="border-y border-zinc-800 bg-zinc-900/40 py-5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-10 px-6">
          {[
            { stat: '2,400+', label: 'Active Traders' },
            { stat: '94%',    label: 'Signal Accuracy' },
            { stat: '$0',     label: 'Hidden Fees' },
            { stat: '12ms',   label: 'Signal Latency' },
            { stat: '24/7',   label: 'Market Coverage' },
          ].map(({ stat, label }) => (
            <div key={label} className="text-center">
              <p className="text-xl font-extrabold text-zinc-50">{stat}</p>
              <p className="text-xs text-zinc-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="mx-auto max-w-xl px-6 py-24 text-center">
          <p className="text-zinc-400">Products coming soon. Configure your Shopify env vars.</p>
        </div>
      ) : (
        <>
          {/* ── Subscriptions ──────────────────────────────────────────── */}
          {subscriptions.length > 0 && (
            <section className="mx-auto max-w-6xl px-6 pt-20">
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold text-zinc-50">Choose Your Plan</h2>
                <p className="mt-2 text-zinc-400">All plans include AI signals, AI assistant, and discipline coach</p>
              </div>
              <div className={`grid gap-6 ${
                subscriptions.length <= 2 ? 'sm:grid-cols-2 max-w-3xl mx-auto' :
                subscriptions.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4'
              }`}>
                {subscriptions.map((product) => {
                  const h = product.handle.toLowerCase();
                  const featured = h.includes('yearly') || h.includes('annual');
                  return <ProductCard key={product.id} product={product} featured={featured} />;
                })}
              </div>
            </section>
          )}

          {/* ── Competitor Comparison ───────────────────────────────────── */}
          <section className="mx-auto max-w-5xl px-6 pt-24">
            <div className="mb-10 text-center">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1">
                <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">Why Switch</span>
              </div>
              <h2 className="text-3xl font-bold text-zinc-50">Alpha Flow vs The Competition</h2>
              <p className="mt-2 text-zinc-400">See why thousands of traders are switching from legacy platforms</p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-zinc-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="px-6 py-4 text-left font-semibold text-zinc-400 w-48">Feature</th>
                    <th className="px-4 py-4 text-center">
                      <div className="inline-flex flex-col items-center gap-1">
                        <span className="rounded-full bg-cyan-500 px-3 py-0.5 text-xs font-bold text-black uppercase tracking-wide">Alpha Flow</span>
                        <span className="text-xs text-zinc-400 font-normal">from $79/mo</span>
                      </div>
                    </th>
                    <th className="px-4 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-semibold text-zinc-300">Warrior Trading</span>
                        <span className="text-xs text-zinc-500 font-normal">$147/mo</span>
                      </div>
                    </th>
                    <th className="px-4 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-semibold text-zinc-300">BlackBoxStocks</span>
                        <span className="text-xs text-zinc-500 font-normal">$149/mo</span>
                      </div>
                    </th>
                    <th className="px-4 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-semibold text-zinc-300">FlowAlgo</span>
                        <span className="text-xs text-zinc-500 font-normal">$149/mo</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row, i) => (
                    <tr key={row.feature} className={`border-b border-zinc-800/60 ${i % 2 === 0 ? 'bg-zinc-900/20' : ''}`}>
                      <td className="px-6 py-3.5 font-medium text-zinc-300">{row.feature}</td>
                      <td className="px-4 py-3.5 text-center bg-cyan-500/5">
                        {typeof row.alphaflow === 'boolean'
                          ? <Check yes={row.alphaflow} />
                          : <span className="font-bold text-cyan-400">{row.alphaflow}</span>}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {typeof row.warrior === 'boolean'
                          ? <Check yes={row.warrior} />
                          : <span className="text-zinc-300">{row.warrior}</span>}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {typeof row.blackbox === 'boolean'
                          ? <Check yes={row.blackbox} />
                          : <span className="text-zinc-300">{row.blackbox}</span>}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {typeof row.flowalgo === 'boolean'
                          ? <Check yes={row.flowalgo} />
                          : <span className="text-zinc-300">{row.flowalgo}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-center text-xs text-zinc-600">
              Competitor prices as of Feb 2026. Alpha Flow Pro plan used for comparison.
            </p>
          </section>

          {/* ── Why Alpha Flow ──────────────────────────────────────────── */}
          <section className="mx-auto max-w-6xl px-6 pt-24">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-zinc-50">Built Different</h2>
              <p className="mt-2 text-zinc-400">Everything competitors charge extra for — included by default</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                {
                  icon: '🤖',
                  title: 'AI-Native, Not AI-Bolted',
                  body: 'Trade Ideas added "Holly AI" to a 20-year-old scanner. FlowAlgo recently tacked on "Alpha AI Signals." Alpha Flow was built around AI from the ground up — it\'s not a feature, it\'s the foundation.',
                },
                {
                  icon: '🧠',
                  title: 'The Only Platform with a Discipline Coach',
                  body: 'No competitor offers an AI discipline coach. Alpha Flow\'s coach helps you avoid overtrading, revenge trading, and FOMO — the behaviors that cost traders more than bad signals ever will.',
                },
                {
                  icon: '💰',
                  title: 'Half the Price of Legacy Platforms',
                  body: 'Warrior Trading live stream is $147/mo. Investors Underground is $297/mo. Alpha Flow Pro is $79/mo with more AI features than any of them. Keep more of your profits.',
                },
              ].map(({ icon, title, body }) => (
                <div key={title} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                  <div className="mb-3 text-3xl">{icon}</div>
                  <h3 className="mb-2 text-base font-bold text-zinc-50">{title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-400">{body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Tools, Templates & Guides ───────────────────────────── */}
          {tools.length > 0 && (
            <section className="mx-auto max-w-6xl px-6 pt-24">
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold text-zinc-50">Tools, Templates &amp; Guides</h2>
                <p className="mt-2 text-zinc-400">One-time purchase · Instant access · Used by active traders every day</p>
              </div>
              <div className={`grid gap-6 ${
                tools.length === 1 ? 'max-w-sm mx-auto' :
                tools.length === 2 ? 'sm:grid-cols-2 max-w-3xl mx-auto' : 'sm:grid-cols-3'
              }`}>
                {tools.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            </section>
          )}

          {/* ── eBooks ──────────────────────────────────────────────── */}
          {ebooks.length > 0 && (
            <section className="mx-auto max-w-6xl px-6 pt-24">
              <div className="mb-10 text-center">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/5 px-3 py-1">
                  <span className="text-xs font-semibold uppercase tracking-widest text-rose-400">eBooks</span>
                </div>
                <h2 className="text-3xl font-bold text-zinc-50">Trading Knowledge, Instantly</h2>
                <p className="mt-2 text-zinc-400">Straight-to-the-point guides on the topics that cost traders the most money</p>
              </div>
              <div className={`grid gap-6 ${
                ebooks.length === 1 ? 'max-w-sm mx-auto' :
                ebooks.length === 2 ? 'sm:grid-cols-2 max-w-3xl mx-auto' : 'sm:grid-cols-3'
              }`}>
                {ebooks.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            </section>
          )}

          {/* ── Bundle ──────────────────────────────────────────────────── */}
          {bundles.length > 0 && (
            <section className="mx-auto max-w-4xl px-6 pt-24">
              <div className="mb-10 text-center">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1">
                  <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">Best Value</span>
                </div>
                <h2 className="text-3xl font-bold text-zinc-50">Get Everything at Once</h2>
                <p className="mt-2 text-zinc-400">Journal + Calculator + 2 PDF guides bundled together — save $73 vs buying separately</p>
              </div>
              <div className={`grid gap-6 ${bundles.length === 1 ? 'max-w-lg mx-auto' : 'sm:grid-cols-2'}`}>
                {bundles.map((product) => <ProductCard key={product.id} product={product} featured />)}
              </div>
            </section>
          )}
        </>
      )}

      {/* ── Testimonials ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pt-24">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-zinc-50">Traders Love It</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              quote: "I was paying $297/mo for Investors Underground. Switched to Alpha Flow Elite and get more features for $197. The AI coach alone is worth it — it stopped me from revenge trading after a bad week.",
              name: 'Marcus T.',
              role: 'Day Trader, 4 years',
              stars: 5,
            },
            {
              quote: "The discipline coach is unlike anything else on the market. After a losing streak it walked me through exactly what I did wrong and helped me rebuild my rules. No other platform does this.",
              name: 'Priya S.',
              role: 'Swing Trader',
              stars: 5,
            },
            {
              quote: "Tried Warrior Trading, Trade Ideas, BlackBoxStocks. Alpha Flow is the first platform where the AI actually understands context. Ask it why a signal fired and it explains. Game changer.",
              name: 'Derek W.',
              role: 'Full-time Trader',
              stars: 5,
            },
          ].map(({ quote, name, role, stars }) => (
            <div key={name} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: stars }).map((_, i) => (
                  <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
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

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 pb-24 pt-24">
        <h2 className="mb-8 text-center text-3xl font-bold text-zinc-50">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {[
            {
              q: 'How is Alpha Flow different from Trade Ideas or BlackBoxStocks?',
              a: 'Those platforms added AI as a feature on top of legacy scanner tools. Alpha Flow was built AI-native — the AI assistant and discipline coach are core to the product, not bolt-ons. Alpha Flow also costs significantly less: $79/mo vs $149/mo for either competitor.',
            },
            {
              q: 'What is the AI Discipline Coach?',
              a: 'The discipline coach is a separate AI trained specifically to help traders maintain consistent rules, avoid overtrading, FOMO, and revenge trading. It runs pre-trade checklists, end-of-day reviews, and real-time position sizing calculations. No competitor offers anything like it.',
            },
            {
              q: 'Can I cancel at any time?',
              a: 'Yes. Cancel anytime from your account, no questions asked. All plans also come with a 30-day money-back guarantee.',
            },
            {
              q: 'What markets does Alpha Flow cover?',
              a: 'Equities, crypto, and forex — all markets with real-time AI signals and multi-timeframe analysis. Unlike Warrior Trading which focuses on equities only, Alpha Flow covers all three.',
            },
            {
              q: 'Are the courses as good as Warrior Trading?',
              a: 'Warrior Trading charges $2,997 for their Pro course. Our Trading Psychology Masterclass is $297 — 90% less. It covers the most important factor separating profitable traders: psychology and discipline.',
            },
            {
              q: 'Do I need any experience to start?',
              a: 'No. The Alpha Flow Free plan is a great starting point. The AI assistant answers questions, the coach builds discipline, and the signals are clearly explained with context — not just buy/sell alerts.',
            },
          ].map(({ q, a }) => (
            <details key={q} className="group rounded-xl border border-zinc-800 bg-zinc-900/50 px-6 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-zinc-200">
                {q}
                <svg className="h-4 w-4 flex-shrink-0 text-zinc-500 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────────────── */}
      <section className="border-t border-zinc-800 bg-zinc-900/30 px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-zinc-50">Start Trading Smarter Today</h2>
        <p className="mt-3 text-zinc-400">Join 2,400+ traders. 30-day money-back guarantee. No risk.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a href="#plans" className="rounded-xl bg-cyan-500 px-8 py-3.5 text-sm font-bold text-black transition-colors hover:bg-cyan-400">
            Get Started Free
          </a>
          <a href="/chat" className="rounded-xl border border-zinc-700 px-8 py-3.5 text-sm font-semibold text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-50">
            Try the AI Assistant
          </a>
        </div>
      </section>
    </div>
  );
}
