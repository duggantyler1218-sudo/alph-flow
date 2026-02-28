'use client';

import Link from 'next/link';
import { useCart } from './cart-provider';

export function Nav() {
  const { cart, openCart } = useCart();
  const quantity = cart?.totalQuantity ?? 0;

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-zinc-50 transition-opacity hover:opacity-80"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500">
            <svg className="h-4 w-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </span>
          Alpha Flow
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/store"
            className="text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-50"
          >
            Pricing
          </Link>
          <Link
            href="/coach"
            className="text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-50"
          >
            Coach
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-50"
          >
            Signals
          </Link>
          <Link
            href="/chat"
            className="text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-50"
          >
            Dashboard
          </Link>

          {/* Cart button */}
          <button
            onClick={openCart}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-50"
            aria-label="Open cart"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            {quantity > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-black">
                {quantity > 9 ? '9+' : quantity}
              </span>
            )}
          </button>

          <Link
            href="/store"
            className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-cyan-400"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}
