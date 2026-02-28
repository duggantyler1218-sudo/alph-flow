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
  variantId: string;     // numeric Shopify variant ID
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

function loadItems(): LocalCartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function saveItems(items: LocalCartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<LocalCartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setItems(loadItems());
  }, []);

  const cart = itemsToCart(items);

  const addToCart = useCallback(async (lines: CartLineInput[]) => {
    setIsLoading(true);
    try {
      setItems((prev) => {
        const next = [...prev];
        for (const line of lines) {
          const variantId = extractVariantId(line.merchandiseId);
          const existing = next.find((i) => i.variantId === variantId);
          if (existing) {
            existing.quantity += line.quantity;
          } else {
            next.push({
              lineId: `line-${Date.now()}-${Math.random().toString(36).slice(2)}`,
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
        saveItems(next);
        return next;
      });
      setIsOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateLine = useCallback(async (updateLines: CartLineUpdateInput[]) => {
    setItems((prev) => {
      const next = prev
        .map((i) => {
          const upd = updateLines.find((u) => u.id === i.lineId);
          return upd ? { ...i, quantity: upd.quantity } : i;
        })
        .filter((i) => i.quantity > 0);
      saveItems(next);
      return next;
    });
  }, []);

  const removeLine = useCallback(async (lineIds: string[]) => {
    setItems((prev) => {
      const next = prev.filter((i) => !lineIds.includes(i.lineId));
      saveItems(next);
      return next;
    });
  }, []);

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
