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

interface LocalCartItem {
  lineId: string;
  variantId: string;
  quantity: number;
  productTitle: string;
  variantTitle: string;
  price: string;
  currencyCode: string;
  imageUrl: string | null;
}

const CartContext = createContext<CartContextValue | null>(null);
const CART_KEY = 'af_cart_v2';
const SHOP = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? '';

function extractVariantId(gid: string): string {
  // handles "gid://shopify/ProductVariant/12345" → "12345"
  // or just "12345" → "12345"
  return gid.split('/').pop() ?? gid;
}

function buildCheckoutUrl(items: LocalCartItem[]): string {
  if (!SHOP || items.length === 0) return '#';
  const parts = items.map((i) => `${i.variantId}:${i.quantity}`).join(',');
  return `https://${SHOP}/cart/${parts}`;
}

function itemsToCart(items: LocalCartItem[]): ShopifyCart | null {
  if (items.length === 0) return null;
  const currencyCode = items[0]?.currencyCode ?? 'USD';
  const total = items.reduce((s, i) => s + parseFloat(i.price) * i.quantity, 0);
  return {
    id: 'local-cart',
    checkoutUrl: buildCheckoutUrl(items),
    cost: {
      subtotalAmount: { amount: total.toFixed(2), currencyCode },
      totalAmount: { amount: total.toFixed(2), currencyCode },
    },
    lines: {
      edges: items.map((i) => ({
        node: {
          id: i.lineId,
          quantity: i.quantity,
          merchandise: {
            id: `gid://shopify/ProductVariant/${i.variantId}`,
            title: i.variantTitle,
            product: {
              title: i.productTitle,
              handle: '',
              featuredImage: i.imageUrl ? { url: i.imageUrl, altText: null } : null,
            },
            price: { amount: i.price, currencyCode: i.currencyCode },
          },
          cost: {
            totalAmount: {
              amount: (parseFloat(i.price) * i.quantity).toFixed(2),
              currencyCode: i.currencyCode,
            },
          },
        },
      })),
    },
    totalQuantity: items.reduce((s, i) => s + i.quantity, 0),
  };
}

function readStorage(): LocalCartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeStorage(items: LocalCartItem[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // ignore — e.g. private browsing / storage full
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<LocalCartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = readStorage();
    if (saved.length > 0) setItems(saved);
  }, []);

  // Persist to localStorage whenever items change
  useEffect(() => {
    writeStorage(items);
  }, [items]);

  const cart = itemsToCart(items);

  const addToCart = useCallback((lines: CartLineInput[]) => {
    setItems((prev) => {
      const next = [...prev];
      for (const line of lines) {
        const variantId = extractVariantId(line.merchandiseId);
        const idx = next.findIndex((i) => i.variantId === variantId);
        if (idx >= 0) {
          // Replace the item with updated quantity (immutable)
          next[idx] = { ...next[idx], quantity: next[idx].quantity + line.quantity };
        } else {
          next.push({
            lineId: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            variantId,
            quantity: line.quantity,
            productTitle: line.productTitle ?? 'Product',
            variantTitle: line.variantTitle ?? '',
            price: line.price ?? '0',
            currencyCode: line.currencyCode ?? 'USD',
            imageUrl: line.imageUrl ?? null,
          });
        }
      }
      return next;
    });
    setIsOpen(true);
    return Promise.resolve();
  }, []);

  const updateLine = useCallback((updateLines: CartLineUpdateInput[]) => {
    setItems((prev) =>
      prev
        .map((i) => {
          const u = updateLines.find((ul) => ul.id === i.lineId);
          return u ? { ...i, quantity: u.quantity } : i;
        })
        .filter((i) => i.quantity > 0)
    );
    return Promise.resolve();
  }, []);

  const removeLine = useCallback((lineIds: string[]) => {
    setItems((prev) => prev.filter((i) => !lineIds.includes(i.lineId)));
    return Promise.resolve();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        isLoading: false,
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
