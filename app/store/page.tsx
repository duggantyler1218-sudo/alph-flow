import { getProducts } from '@/lib/shopify/client';
import { ProductCard } from '@/components/store/product-card';
import type { Metadata } from 'next';
import type { ShopifyProduct } from '@/lib/shopify/types';

export const metadata: Metadata = {
  title: 'Pricing — Alpha Flow',
  description: 'Choose the Alpha Flow AI trading plan that fits your strategy.',
};

function categorize(products: ShopifyProduct[]) {
  const subscriptions: ShopifyProduct[] = [];
  const oneTime: ShopifyProduct[] = [];
  const bundles: ShopifyProduct[] = [];

  for (const p of products) {
    const h = p.handle.toLowerCase();
    if (h.includes('bundle')) {
      bundles.push(p);
    } else if (
      h.includes('masterclass') ||
      h.includes('course') ||
      h.includes('playbook') ||
      h.includes('guide') ||
      h.includes('pdf') ||
      h.includes('prompt') ||
      h.includes('pack')
    ) {
      oneTime.push(p);
    } else {
      subscriptions.push(p);
    }
  }

  // Sort subscriptions: free → monthly → yearly → elite
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

  return { subscriptions, oneTime, bundles };
}

export default async function StorePage() {
  const products = await getProducts();
  const { subscriptions, oneTime, bundles } = categorize(products);

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

      {products.length === 0 ? (
        <div className="mx-auto max-w-xl px-6 py-24 text-center">
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
        <div className="mx-auto max-w-6xl px-6 pb-24 space-y-24">

          {/* Subscriptions */}
          {subscriptions.length > 0 && (
            <section className="pt-16">
              <div className="mb-10 text-center">
                <h2 className="text-2xl font-bold text-zinc-50">Subscription Plans</h2>
                <p className="mt-2 text-sm text-zinc-400">Full platform access, cancel anytime</p>
              </div>
              <div className={`grid gap-8 ${subscriptions.length === 1 ? 'max-w-sm mx-auto' : subscriptions.length === 2 ? 'sm:grid-cols-2 max-w-3xl mx-auto' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
                {subscriptions.map((product) => {
                  const h = product.handle.toLowerCase();
                  const featured = h.includes('yearly') || h.includes('annual');
                  return (
                    <ProductCard key={product.id} product={product} featured={featured} />
                  );
                })}
              </div>
            </section>
          )}

          {/* One-time products */}
          {oneTime.length > 0 && (
            <section>
              <div className="mb-10 text-center">
                <h2 className="text-2xl font-bold text-zinc-50">Tools &amp; Courses</h2>
                <p className="mt-2 text-sm text-zinc-400">One-time purchase, lifetime access</p>
              </div>
              <div className={`grid gap-8 ${oneTime.length === 1 ? 'max-w-sm mx-auto' : oneTime.length === 2 ? 'sm:grid-cols-2 max-w-3xl mx-auto' : 'sm:grid-cols-3'}`}>
                {oneTime.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}

          {/* Bundles */}
          {bundles.length > 0 && (
            <section>
              <div className="mb-10 text-center">
                <h2 className="text-2xl font-bold text-zinc-50">Bundles</h2>
                <p className="mt-2 text-sm text-zinc-400">Everything you need, packaged together</p>
              </div>
              <div className={`grid gap-8 ${bundles.length === 1 ? 'max-w-sm mx-auto' : 'sm:grid-cols-2 max-w-3xl mx-auto'}`}>
                {bundles.map((product) => (
                  <ProductCard key={product.id} product={product} featured />
                ))}
              </div>
            </section>
          )}

        </div>
      )}

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
              a: "All paid plans come with a 30-day money-back guarantee. Try Alpha Flow risk-free and get a full refund if you're not satisfied.",
            },
            {
              q: 'What markets does Alpha Flow support?',
              a: 'Alpha Flow covers equities, crypto, and forex markets with real-time AI analysis and multi-timeframe signals.',
            },
            {
              q: 'What is the AI Discipline Coach?',
              a: 'The Coach is a separate AI trained to help you stay disciplined — it runs pre-trade checklists, daily reviews, risk calculations, and helps you avoid overtrading and FOMO. It is not a financial advisor.',
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
