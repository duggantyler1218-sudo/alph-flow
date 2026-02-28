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

  if (h.includes('prompt') || h.includes('pack'))
    return {
      type: 'tool',
      tier: null,
      badge: 'Prompt Pack',
      billingLabel: 'one-time',
      features: [
        '50 AI coach prompts',
        'Pre-trade checklists',
        'End-of-day review templates',
        'Risk calc prompts',
        'Instant access',
      ],
    };

  if (h.includes('toolkit'))
    return {
      type: 'bundle',
      tier: null,
      badge: 'Bundle',
      billingLabel: 'one-time',
      features: [
        'Risk Management Playbook (PDF)',
        'AI Prompt Pack — 50 prompts',
        'Trader Psychology Quick Guide',
        'Save $41 vs buying separately',
        'Instant download, lifetime access',
      ],
    };

  if (h.includes('bundle'))
    return {
      type: 'bundle',
      tier: null,
      badge: 'Bundle',
      billingLabel: 'one-time',
      features: [
        'Risk Management Playbook',
        'AI Prompt Pack (50 prompts)',
        'Save vs buying separately',
        'Instant access to everything',
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
          <span
            className={`text-xs font-semibold uppercase tracking-widest ${
              featured ? 'text-cyan-400' : 'text-zinc-500'
            }`}
          >
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
              : 'Buy Now'
          }
          featured={featured}
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
        {meta.type === 'subscription' ? 'Cancel anytime · No hidden fees' : '30-day money-back guarantee'}
      </p>
    </div>
  );
}
