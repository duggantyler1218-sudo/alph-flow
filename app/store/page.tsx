import { getProducts } from '@/lib/shopify/client';
import { ProductCard } from '@/components/store/product-card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing — Alpha Flow',
  description: 'Choose the Alpha Flow AI trading plan that fits your strategy.',
};

export default async function StorePage() {
  const products = await getProducts();

  // Sort: yearly plan last (featured on right)
  const sorted = [...products].sort((a, b) => {
    const aIsYearly = a.handle.includes('yearly') || a.handle.includes('annual') || a.title.toLowerCase().includes('year');
    const bIsYearly = b.handle.includes('yearly') || b.handle.includes('annual') || b.title.toLowerCase().includes('year');
    return aIsYearly === bIsYearly ? 0 : aIsYearly ? 1 : -1;
  });

  return (
    <div className="min-h-screen bg-zinc-950 pt-24">
      {/* Header */}
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-12 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
          <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
            Simple Pricing
          </span>
        </div>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-zinc-50 sm:text-5xl">
          Invest in Your Edge
        </h1>
        <p className="mx-auto max-w-xl text-lg text-zinc-400">
          Unlock AI-powered trade signals, real-time analysis, and institutional-grade
          risk management. Cancel anytime.
        </p>
      </section>

      {/* Trust bar */}
      <div className="border-y border-zinc-800 bg-zinc-900/40 py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-8 px-6">
          {[
            { icon: '🔒', label: 'Secure checkout' },
            { icon: '↩️', label: '30-day money-back guarantee' },
            { icon: '⚡', label: 'Instant access' },
            { icon: '🌎', label: '2,400+ traders worldwide' },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm text-zinc-400">
              <span>{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Product cards */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        {products.length === 0 ? (
          <div className="text-center">
            <p className="text-zinc-400">
              Products coming soon. Make sure your Shopify store and environment
              variables are configured.
            </p>
            <p className="mt-2 text-sm text-zinc-600">
              Set <code className="text-cyan-400">NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN</code> and{' '}
              <code className="text-cyan-400">NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN</code> in{' '}
              <code className="text-zinc-500">.env.local</code>
            </p>
          </div>
        ) : (
          <div className={`grid gap-8 ${sorted.length === 1 ? 'max-w-sm mx-auto' : 'sm:grid-cols-2'}`}>
            {sorted.map((product, i) => {
              const isYearly =
                product.handle.includes('yearly') ||
                product.handle.includes('annual') ||
                product.title.toLowerCase().includes('year');
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  featured={isYearly || (sorted.length === 1 && i === 0)}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 pb-24">
        <h2 className="mb-8 text-center text-2xl font-bold text-zinc-50">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {[
            {
              q: 'Can I cancel at any time?',
              a: 'Yes. You can cancel your subscription at any time from your Shopify account or by contacting support. No questions asked.',
            },
            {
              q: 'What payment methods are accepted?',
              a: 'We accept all major credit cards, Apple Pay, and Google Pay via Shopify Payments — the same trusted checkout used by millions of stores worldwide.',
            },
            {
              q: 'Is there a free trial?',
              a: 'All plans come with a 30-day money-back guarantee. Try Alpha Flow risk-free and get a full refund if you\'re not satisfied.',
            },
            {
              q: 'What markets does Alpha Flow support?',
              a: 'Alpha Flow covers equities, crypto, and forex markets with real-time AI analysis and multi-timeframe signals.',
            },
          ].map(({ q, a }) => (
            <details
              key={q}
              className="group rounded-xl border border-zinc-800 bg-zinc-900/50 px-6 py-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-zinc-200">
                {q}
                <svg
                  className="h-4 w-4 flex-shrink-0 text-zinc-500 transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
