import Link from 'next/link';
import { formatPrice } from '@/lib/shopify/client';
import type { ShopifyProduct } from '@/lib/shopify/types';
import { AddToCartButton } from './add-to-cart-button';

interface ProductCardProps {
  product: ShopifyProduct;
  featured?: boolean;
}

function getProductMeta(handle: string, title: string) {
  const h = handle.toLowerCase();
  const t = title.toLowerCase();

  if (h.includes('elite'))
    return {
      type: 'subscription',
      tier: 'elite',
      badge: 'Elite',
      billingLabel: h.includes('yearly') || h.includes('annual') ? '/ year' : '/ month',
      features: [
        'Everything in Pro',
        'Priority support 24/7',
        'Custom risk rule engine',
        'Advanced portfolio tracking',
        '1-on-1 AI coach sessions',
        ...(h.includes('yearly') || h.includes('annual') ? ['2 months free'] : []),
      ],
    };

  if (h.includes('pro') || h.includes('monthly') || h.includes('yearly') || h.includes('annual'))
    return {
      type: 'subscription',
      tier: 'pro',
      badge: null,
      billingLabel: h.includes('yearly') || h.includes('annual') ? '/ year' : '/ month',
      features: [
        'Unlimited AI trade signals',
        'Multi-timeframe analysis',
        'Risk management alerts',
        'AI assistant + discipline coach',
        'Portfolio optimization',
        ...(h.includes('yearly') || h.includes('annual') ? ['Priority support', '2 months free'] : []),
      ],
    };

  if (h.includes('free'))
    return {
      type: 'subscription',
      tier: 'free',
      badge: 'Free Forever',
      billingLabel: '/ month',
      features: [
        '3 AI signals per day',
        'Basic market analysis',
        'AI assistant (10 msgs/day)',
        'Community access',
      ],
    };

  if (h.includes('masterclass') || h.includes('course') || t.includes('masterclass'))
    return {
      type: 'course',
      tier: null,
      badge: 'Course',
      billingLabel: 'one-time',
      features: [
        '12 in-depth video modules',
        'FOMO & revenge trading',
        'Building a trade plan',
        'Mindset & emotional control',
        'Lifetime access',
      ],
    };

  if (h.includes('journal'))
    return {
      type: 'template',
      tier: null,
      badge: 'Google Sheets',
      billingLabel: 'one-time',
      features: [
        'Automatic P&L tracking',
        'Win rate & avg R:R dashboards',
        'Daily, weekly, monthly views',
        'Emotional state & mistake log',
        'Strategy tag system',
        'Instant access after purchase',
      ],
    };

  if (h.includes('position-sizing') || h.includes('calculator'))
    return {
      type: 'template',
      tier: null,
      badge: 'Google Sheets',
      billingLabel: 'one-time',
      features: [
        'Auto position size from risk %',
        'Max daily loss tracker',
        'Options contract sizing',
        'Stocks, futures, forex, crypto',
        'Side-by-side scenario compare',
        'Instant access after purchase',
      ],
    };

  if (h.includes('price-action') || h.includes('price_action'))
    return {
      type: 'guide',
      tier: null,
      badge: 'PDF Guide',
      billingLabel: 'one-time',
      features: [
        '20+ chart patterns with examples',
        'Support & resistance methods',
        'Entry trigger rules per setup',
        'Stop loss & target placement',
        'Multi-timeframe confirmation',
        '58-page PDF, instant download',
      ],
    };

  if (h.includes('gap') || h.includes('gap-and-go'))
    return {
      type: 'guide',
      tier: null,
      badge: 'PDF Guide',
      billingLabel: 'one-time',
      features: [
        'Pre-market gap scanner criteria',
        'Exact entry triggers & timing',
        'Stop placement techniques',
        'Real trade examples annotated',
        'Common gap traps to avoid',
        '42-page PDF, instant download',
      ],
    };

  if (h.includes('playbook') || h.includes('guide') || h.includes('pdf'))
    return {
      type: 'guide',
      tier: null,
      badge: 'PDF Guide',
      billingLabel: 'one-time',
      features: [
        'Position sizing formulas',
        'Stop loss strategies',
        'Max drawdown rules',
        'Risk/reward frameworks',
        'Instant PDF download',
      ],
    };

  if (h.includes('ebook')) {
    const features: Record<string, string[]> = {
      'stop-revenge-trading': [
        '30-day structured discipline reset',
        'Identify & break revenge trading triggers',
        'Daily mindset check-in exercises',
        'Stop-the-spiral emergency action plan',
        'Instant PDF download',
      ],
      'options-trading-beginners': [
        'Calls, puts & spreads explained simply',
        'How to read an options chain',
        'Buying vs selling options',
        'Risk management on every trade',
        'Instant PDF download',
      ],
      'profitable-traders-habits': [
        '7 science-backed trading habits',
        'Daily routines of consistent traders',
        'How to eliminate emotional decisions',
        'Building a bulletproof trade plan',
        'Instant PDF download',
      ],
      'crypto-beginners': [
        'Buy, trade & store crypto safely',
        'Wallets, exchanges & security',
        'Crypto trading fundamentals',
        'Portfolio & risk basics',
        'Instant PDF download',
      ],
      '5am-trader': [
        '5AM pre-market research routine',
        'Gap scan & watchlist building',
        'Mental prep before market open',
        'Trade plan template included',
        'Instant PDF download',
      ],
    };
    const key = Object.keys(features).find((k) => h.includes(k));
    return {
      type: 'ebook',
      tier: null,
      badge: 'eBook',
      billingLabel: 'one-time',
      features: key ? features[key] : ['Instant PDF download'],
    };
  }

  if (h.includes('complete-trader') || h.includes('toolkit') || h.includes('bundle'))
    return {
      type: 'bundle',
      tier: null,
      badge: 'Bundle',
      billingLabel: 'one-time',
      features: [
        'Day Trading Journal (Sheets)',
        'Position Sizing Calculator (Sheets)',
        'Price Action Setup Guide (PDF)',
        'Gap & Go Strategy Playbook (PDF)',
        'Save $73 vs buying separately',
        'Lifetime access to all updates',
      ],
    };

  return {
    type: 'other',
    tier: null,
    badge: null,
    billingLabel: '',
    features: [],
  };
}

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const variant = product.variants.edges[0]?.node;
  const price = variant?.price;
  const compareAt = variant?.compareAtPrice;
  const meta = getProductMeta(product.handle, product.title);

  const savings =
    compareAt && price
      ? Math.round(
          ((parseFloat(compareAt.amount) - parseFloat(price.amount)) /
            parseFloat(compareAt.amount)) *
            100
        )
      : null;

  const isYearly =
    product.handle.includes('yearly') || product.handle.includes('annual');

  const badgeColor =
    meta.type === 'template'   ? 'text-green-400' :
    meta.type === 'guide'      ? 'text-amber-400' :
    meta.type === 'course'     ? 'text-purple-400' :
    meta.type === 'bundle'     ? 'text-cyan-400' :
    meta.type === 'ebook'      ? 'text-rose-400' :
    featured                   ? 'text-cyan-400' :
                                 'text-zinc-500';

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-300 ${
        featured
          ? 'border-cyan-500/50 bg-zinc-900 shadow-[0_0_40px_rgba(6,182,212,0.12)]'
          : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
      }`}
    >
      {/* Featured badge */}
      {featured && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-cyan-500 px-4 py-1 text-xs font-bold uppercase tracking-wide text-black">
            Best Value
          </span>
        </div>
      )}

      {/* Type badge */}
      <div className="mb-2 flex items-center gap-2">
        {meta.badge && (
          <span className={`text-xs font-semibold uppercase tracking-widest ${badgeColor}`}>
            {meta.badge}
          </span>
        )}
        {savings && (
          <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-semibold text-green-400">
            Save {savings}%
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="mb-4 text-xl font-bold text-zinc-50">{product.title}</h3>

      {/* Price */}
      <div className="mb-6">
        {price ? (
          <div className="flex items-end gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-zinc-50">
              {parseFloat(price.amount) === 0
                ? 'Free'
                : formatPrice(price.amount, price.currencyCode)}
            </span>
            {parseFloat(price.amount) > 0 && (
              <span className="mb-1 text-sm text-zinc-500">{meta.billingLabel}</span>
            )}
          </div>
        ) : (
          <span className="text-4xl font-extrabold text-zinc-50">—</span>
        )}
        {compareAt && (
          <p className="mt-1 text-sm text-zinc-500 line-through">
            {formatPrice(compareAt.amount, compareAt.currencyCode)}
          </p>
        )}
        {isYearly && price && parseFloat(price.amount) > 0 && (
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

      {/* Features */}
      {meta.features.length > 0 && (
        <ul className="mb-8 flex-1 space-y-3">
          {meta.features.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm text-zinc-300">
              <svg
                className={`h-4 w-4 flex-shrink-0 ${featured ? 'text-cyan-400' : 'text-zinc-500'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      )}

      {/* CTA */}
      {variant ? (
        <AddToCartButton
          merchandiseId={variant.id}
          label={
            meta.type === 'subscription'
              ? `Get ${meta.tier === 'free' ? 'Started Free' : isYearly ? 'Annual Plan' : 'Monthly Plan'}`
              : meta.type === 'bundle' ? 'Get the Bundle'
              : 'Download Now'
          }
          featured={featured}
          productTitle={product.title}
          price={variant.price.amount}
          currencyCode={variant.price.currencyCode}
          imageUrl={product.featuredImage?.url ?? null}
        />
      ) : (
        <Link
          href={`/store/${product.handle}`}
          className={`flex w-full items-center justify-center rounded-xl py-3.5 text-sm font-bold transition-colors ${
            featured
              ? 'bg-cyan-500 text-black hover:bg-cyan-400'
              : 'border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-zinc-50'
          }`}
        >
          View Details
        </Link>
      )}

      <p className="mt-4 text-center text-xs text-zinc-600">
        {meta.type === 'subscription' ? 'Cancel anytime · No hidden fees' : 'Instant access · 30-day money-back guarantee'}
      </p>
    </div>
  );
}
