import Link from 'next/link';
import { formatPrice } from '@/lib/shopify/client';
import type { ShopifyProduct } from '@/lib/shopify/types';
import { AddToCartButton } from './add-to-cart-button';

interface ProductCardProps {
  product: ShopifyProduct;
  featured?: boolean;
}

export function ProductCard({ product, featured = false }: ProductCardProps) {
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
    <div
      className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-300 ${
        featured
          ? 'border-cyan-500/50 bg-zinc-900 shadow-[0_0_40px_rgba(6,182,212,0.12)]'
          : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
      }`}
    >
      {/* Badge */}
      {featured && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-cyan-500 px-4 py-1 text-xs font-bold uppercase tracking-wide text-black">
            Best Value
          </span>
        </div>
      )}

      {/* Plan label */}
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`text-xs font-semibold uppercase tracking-widest ${
            featured ? 'text-cyan-400' : 'text-zinc-500'
          }`}
        >
          {isYearly ? 'Annual Plan' : 'Monthly Plan'}
        </span>
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
              {formatPrice(price.amount, price.currencyCode)}
            </span>
            <span className="mb-1 text-sm text-zinc-500">
              {isYearly ? '/ year' : '/ month'}
            </span>
          </div>
        ) : (
          <span className="text-4xl font-extrabold text-zinc-50">—</span>
        )}
        {compareAt && (
          <p className="mt-1 text-sm text-zinc-500 line-through">
            {formatPrice(compareAt.amount, compareAt.currencyCode)}
          </p>
        )}
        {isYearly && price && (
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

      {/* Feature list */}
      <ul className="mb-8 flex-1 space-y-3">
        {[
          'Real-time AI trade signals',
          'Multi-timeframe analysis',
          'Risk management alerts',
          'Portfolio optimization',
          ...(isYearly ? ['Priority support', '2 months free'] : []),
        ].map((feature) => (
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

      {/* CTA */}
      {variant ? (
        <AddToCartButton
          merchandiseId={variant.id}
          label={`Get ${isYearly ? 'Annual' : 'Monthly'} Plan`}
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

      {/* Trust badge */}
      <p className="mt-4 text-center text-xs text-zinc-600">
        Cancel anytime · No hidden fees
      </p>
    </div>
  );
}
