import { notFound } from 'next/navigation';
import { getProductByHandle, getProducts, formatPrice } from '@/lib/shopify/client';
import { AddToCartButton } from '@/components/store/add-to-cart-button';
import type { Metadata } from 'next';

interface Params {
  params: Promise<{ handle: string }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) return { title: 'Product Not Found — Alpha Flow' };
  return {
    title: `${product.title} — Alpha Flow`,
    description: product.description || `Subscribe to ${product.title} and get AI-powered trading signals.`,
  };
}

export default async function ProductPage({ params }: Params) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) notFound();

  const variant = product.variants.edges[0]?.node;
  const price = variant?.price;
  const compareAt = variant?.compareAtPrice;

  const isYearly =
    product.handle.includes('yearly') ||
    product.handle.includes('annual') ||
    product.title.toLowerCase().includes('year');

  const savings =
    compareAt && price
      ? Math.round(
          ((parseFloat(compareAt.amount) - parseFloat(price.amount)) /
            parseFloat(compareAt.amount)) *
            100
        )
      : null;

  return (
    <div className="min-h-screen bg-zinc-950 pt-24">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-16 lg:grid-cols-2">
          {/* Left: product info */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-cyan-400">
                {isYearly ? 'Annual Plan' : 'Monthly Plan'}
              </span>
              {savings && (
                <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-400">
                  Save {savings}%
                </span>
              )}
            </div>

            <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-zinc-50 sm:text-4xl">
              {product.title}
            </h1>

            {price && (
              <div className="mb-6">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-extrabold tracking-tight text-zinc-50">
                    {formatPrice(price.amount, price.currencyCode)}
                  </span>
                  <span className="mb-2 text-zinc-500">
                    {isYearly ? '/ year' : '/ month'}
                  </span>
                </div>
                {compareAt && (
                  <p className="mt-1 text-sm text-zinc-500 line-through">
                    {formatPrice(compareAt.amount, compareAt.currencyCode)}
                  </p>
                )}
                {isYearly && (
                  <p className="mt-1 text-sm text-zinc-400">
                    ≈{' '}
                    {formatPrice(
                      (parseFloat(price.amount) / 12).toFixed(2),
                      price.currencyCode
                    )}{' '}
                    / month
                  </p>
                )}
              </div>
            )}

            {product.description && (
              <p className="mb-8 leading-relaxed text-zinc-400">
                {product.description}
              </p>
            )}

            {/* Features */}
            <ul className="mb-8 space-y-3">
              {[
                'Real-time AI trade signals across all major markets',
                'Multi-timeframe technical analysis',
                'Risk management alerts and position sizing',
                'Portfolio optimization recommendations',
                'Backtested strategy performance data',
                ...(isYearly
                  ? ['Priority 24/7 support', '2 months free vs monthly']
                  : []),
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-zinc-300">
                  <svg className="h-4 w-4 flex-shrink-0 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            {/* Add to cart */}
            {variant && (
              <AddToCartButton
                merchandiseId={variant.id}
                label={`Subscribe — ${price ? formatPrice(price.amount, price.currencyCode) : ''} ${isYearly ? '/ yr' : '/ mo'}`}
                featured
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-4 text-base font-bold text-black transition-all hover:bg-cyan-400 active:scale-[0.99] disabled:opacity-60"
              />
            )}

            {/* Trust signals */}
            <div className="mt-4 flex flex-wrap gap-3">
              {[
                { icon: '🔒', label: 'Secure checkout' },
                { icon: '↩️', label: '30-day guarantee' },
                { icon: '⚡', label: 'Instant access' },
              ].map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 rounded-lg bg-zinc-800/60 px-3 py-1.5 text-xs text-zinc-400"
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: preview card */}
          <div className="flex items-start justify-center">
            <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500">
                  <svg className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-100">Alpha Flow AI</p>
                  <p className="text-xs text-zinc-500">Live signal preview</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { pair: 'BTC/USD', signal: 'LONG', confidence: 87, color: 'text-green-400' },
                  { pair: 'ETH/USD', signal: 'HOLD', confidence: 72, color: 'text-yellow-400' },
                  { pair: 'SPY', signal: 'LONG', confidence: 91, color: 'text-green-400' },
                  { pair: 'AAPL', signal: 'SHORT', confidence: 68, color: 'text-red-400' },
                ].map(({ pair, signal, confidence, color }) => (
                  <div
                    key={pair}
                    className="flex items-center justify-between rounded-lg bg-zinc-800/60 px-3 py-2.5"
                  >
                    <span className="text-sm font-medium text-zinc-200">{pair}</span>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold ${color}`}>{signal}</span>
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-zinc-700">
                          <div
                            className={`h-full rounded-full ${signal === 'SHORT' ? 'bg-red-400' : signal === 'HOLD' ? 'bg-yellow-400' : 'bg-green-400'}`}
                            style={{ width: `${confidence}%` }}
                          />
                        </div>
                        <span className="text-xs text-zinc-500">{confidence}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-center text-xs text-zinc-600">
                Simulated preview — not financial advice
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
