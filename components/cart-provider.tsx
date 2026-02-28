'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { ShopifyCart, CartLineInput, CartLineUpdateInput } from '@/lib/shopify/types';

interface CartContextValue {
  cart: ShopifyCart | null;
  isOpen: boolean;
  isLoading: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (lines: CartLineInput[]) => Promise<void>;
  updateLine: (lines: CartLineUpdateInput[]) => Promise<void>;
  removeLine: (lineIds: string[]) => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_ID_KEY = 'shopify_cart_id';

async function mutateCart(body: Record<string, unknown>): Promise<ShopifyCart | null> {
  const res = await fetch('/api/shopify/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.cart ?? null;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Rehydrate cart from localStorage on mount
  useEffect(() => {
    const cartId = localStorage.getItem(CART_ID_KEY);
    if (!cartId) return;

    fetch('/api/shopify/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get', cartId }),
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.cart) setCart(json.cart);
      })
      .catch(() => {});
  }, []);

  const persistCart = useCallback((updatedCart: ShopifyCart | null) => {
    setCart(updatedCart);
    if (updatedCart) {
      localStorage.setItem(CART_ID_KEY, updatedCart.id);
    } else {
      localStorage.removeItem(CART_ID_KEY);
    }
  }, []);

  const addToCart = useCallback(
    async (lines: CartLineInput[]) => {
      setIsLoading(true);
      try {
        const cartId = localStorage.getItem(CART_ID_KEY);
        let updated: ShopifyCart | null;

        if (cartId) {
          updated = await mutateCart({ action: 'add', cartId, lines });
        } else {
          updated = await mutateCart({ action: 'create', lines });
        }

        persistCart(updated);
        setIsOpen(true);
      } finally {
        setIsLoading(false);
      }
    },
    [persistCart]
  );

  const updateLine = useCallback(
    async (updateLines: CartLineUpdateInput[]) => {
      const cartId = localStorage.getItem(CART_ID_KEY);
      if (!cartId) return;
      setIsLoading(true);
      try {
        const updated = await mutateCart({ action: 'update', cartId, updateLines });
        persistCart(updated);
      } finally {
        setIsLoading(false);
      }
    },
    [persistCart]
  );

  const removeLine = useCallback(
    async (lineIds: string[]) => {
      const cartId = localStorage.getItem(CART_ID_KEY);
      if (!cartId) return;
      setIsLoading(true);
      try {
        const updated = await mutateCart({ action: 'remove', cartId, lineIds });
        persistCart(updated);
      } finally {
        setIsLoading(false);
      }
    },
    [persistCart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        isLoading,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addToCart,
        updateLine,
        removeLine,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
