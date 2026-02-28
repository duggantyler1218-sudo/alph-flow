'use client';

import { useState } from 'react';
import { useCart } from '@/components/cart-provider';

interface AddToCartButtonProps {
  merchandiseId: string;
  label?: string;
  featured?: boolean;
  className?: string;
}

export function AddToCartButton({
  merchandiseId,
  label = 'Add to Cart',
  featured = false,
  className,
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await addToCart([{ merchandiseId, quantity: 1 }]);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } finally {
      setLoading(false);
    }
  }

  const baseClasses =
    'flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all duration-200 disabled:opacity-60';

  const variantClasses = featured
    ? 'bg-cyan-500 text-black hover:bg-cyan-400 active:scale-[0.98]'
    : 'border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-zinc-50 active:scale-[0.98]';

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={className ?? `${baseClasses} ${variantClasses}`}
    >
      {loading ? (
        <>
          <svg
            className="h-4 w-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Adding...
        </>
      ) : added ? (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Added!
        </>
      ) : (
        label
      )}
    </button>
  );
}
