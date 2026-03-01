'use client';

import { useCart } from './cart-provider';
import { formatPrice } from '@/lib/shopify/client';
import type { ShopifyCartLine } from '@/lib/shopify/types';

export function CartDrawer() {
  const { cart, isOpen, isLoading, closeCart, updateLine, removeLine } = useCart();

  const lines: ShopifyCartLine[] =
    cart?.lines.edges.map((e) => e.node) ?? [];

  const subtotal = cart?.cost.subtotalAmount;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-zinc-900 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-5">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-zinc-50">Cart</h2>
            {cart && cart.totalQuantity > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-xs font-bold text-black">
                {cart.totalQuantity}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-50"
            aria-label="Close cart"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Lines */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800">
                <svg className="h-8 w-8 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-zinc-300">Your cart is empty</p>
                <p className="mt-1 text-sm text-zinc-500">Add a product to get started</p>
              </div>
              <button
                onClick={closeCart}
                className="mt-2 rounded-lg bg-cyan-500 px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-cyan-400"
              >
                View Pricing
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {lines.map((line) => (
                <CartLineItem
                  key={line.id}
                  line={line}
                  onUpdate={updateLine}
                  onRemove={removeLine}
                  disabled={isLoading}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {lines.length > 0 && (
          <div className="border-t border-zinc-800 px-6 py-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-zinc-400">Subtotal</span>
              <span className="text-base font-semibold text-zinc-50">
                {subtotal
                  ? formatPrice(subtotal.amount, subtotal.currencyCode)
                  : '—'}
              </span>
            </div>

            <div className="mb-3 flex items-center gap-2 rounded-lg bg-zinc-800/60 px-3 py-2">
              <svg className="h-4 w-4 flex-shrink-0 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-xs text-zinc-400">Secure checkout powered by Shopify</span>
            </div>

            <a
              href={cart?.checkoutUrl}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3.5 text-sm font-bold text-black transition-colors hover:bg-cyan-400 disabled:opacity-50"
            >
              Proceed to Checkout
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>

            <p className="mt-3 text-center text-xs text-zinc-500">
              Taxes and discounts calculated at checkout
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function CartLineItem({
  line,
  onUpdate,
  onRemove,
  disabled,
}: {
  line: ShopifyCartLine;
  onUpdate: (lines: Array<{ id: string; quantity: number }>) => Promise<void>;
  onRemove: (lineIds: string[]) => Promise<void>;
  disabled: boolean;
}) {
  const { merchandise, quantity, cost } = line;

  return (
    <li className="flex gap-4 rounded-xl bg-zinc-800/50 p-4">
      {/* Image placeholder / icon */}
      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-700">
        {merchandise.product.featuredImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={merchandise.product.featuredImage.url}
            alt={merchandise.product.featuredImage.altText ?? merchandise.product.title}
            className="h-full w-full rounded-lg object-cover"
          />
        ) : (
          <svg className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
          </svg>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-1">
        <p className="text-sm font-medium leading-tight text-zinc-100">
          {merchandise.product.title}
        </p>
        {merchandise.title !== 'Default Title' && (
          <p className="text-xs text-zinc-500">{merchandise.title}</p>
        )}
        <p className="text-sm font-semibold text-cyan-400">
          {formatPrice(cost.totalAmount.amount, cost.totalAmount.currencyCode)}
        </p>

        {/* Quantity controls */}
        <div className="mt-1 flex items-center gap-2">
          <button
            onClick={() =>
              quantity > 1
                ? onUpdate([{ id: line.id, quantity: quantity - 1 }])
                : onRemove([line.id])
            }
            disabled={disabled}
            className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-700 text-zinc-300 transition-colors hover:bg-zinc-600 disabled:opacity-50"
            aria-label="Decrease quantity"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
            </svg>
          </button>
          <span className="w-6 text-center text-sm font-medium text-zinc-200">
            {quantity}
          </span>
          <button
            onClick={() => onUpdate([{ id: line.id, quantity: quantity + 1 }])}
            disabled={disabled}
            className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-700 text-zinc-300 transition-colors hover:bg-zinc-600 disabled:opacity-50"
            aria-label="Increase quantity"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          <button
            onClick={() => onRemove([line.id])}
            disabled={disabled}
            className="ml-auto text-zinc-500 transition-colors hover:text-red-400 disabled:opacity-50"
            aria-label="Remove item"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </li>
  );
}
