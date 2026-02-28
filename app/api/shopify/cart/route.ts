import { NextRequest, NextResponse } from 'next/server';
import type { ShopifyCart, CartLineInput, CartLineUpdateInput } from '@/lib/shopify/types';

const SHOP = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? '';
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN ?? '';
const API = '2026-01';

// Extract numeric ID from GID (e.g. "gid://shopify/ProductVariant/12345" → "12345")
function extractNumericId(gid: string): number {
  const part = gid.split('/').pop() ?? gid;
  return parseInt(part, 10);
}

async function adminFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`https://${SHOP}/admin/api/${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': TOKEN,
      ...((options.headers as Record<string, string>) ?? {}),
    },
  });
  return res.json();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDraftOrder(draft: any): ShopifyCart {
  const currency: string = draft.currency ?? 'USD';
  return {
    id: `gid://shopify/DraftOrder/${draft.id}`,
    checkoutUrl: draft.invoice_url ?? '',
    cost: {
      subtotalAmount: { amount: String(draft.subtotal_price ?? '0'), currencyCode: currency },
      totalAmount:    { amount: String(draft.total_price    ?? '0'), currencyCode: currency },
    },
    lines: {
      edges: (draft.line_items ?? []).map((li: any) => ({
        node: {
          id: String(li.id),
          quantity: li.quantity,
          merchandise: {
            id: `gid://shopify/ProductVariant/${li.variant_id}`,
            title: li.name ?? li.title ?? '',
            product: {
              title: li.title ?? '',
              handle: '',
              featuredImage: null,
            },
            price: { amount: String(li.price ?? '0'), currencyCode: currency },
          },
          cost: {
            totalAmount: {
              amount: String((parseFloat(li.price ?? '0') * li.quantity).toFixed(2)),
              currencyCode: currency,
            },
          },
        },
      })),
    },
    totalQuantity: (draft.line_items ?? []).reduce((s: number, li: any) => s + li.quantity, 0),
  };
}

export async function POST(request: NextRequest) {
  const body: {
    action: string;
    cartId?: string;
    lines?: CartLineInput[];
    updateLines?: CartLineUpdateInput[];
    lineIds?: string[];
  } = await request.json();

  const { action, cartId, lines, updateLines, lineIds } = body;

  if (!SHOP || !TOKEN) {
    return NextResponse.json({ error: 'Shopify not configured' }, { status: 503 });
  }

  try {
    switch (action) {

      case 'create': {
        const lineItems = (lines ?? []).map((l) => ({
          variant_id: extractNumericId(l.merchandiseId),
          quantity: l.quantity,
        }));
        const data = await adminFetch('/draft_orders.json', {
          method: 'POST',
          body: JSON.stringify({ draft_order: { line_items: lineItems } }),
        });
        if (!data.draft_order) {
          return NextResponse.json({ error: data.errors ?? 'Failed to create cart' }, { status: 400 });
        }
        return NextResponse.json({ cart: mapDraftOrder(data.draft_order) });
      }

      case 'add': {
        if (!cartId) return NextResponse.json({ error: 'cartId required' }, { status: 400 });
        const draftId = extractNumericId(cartId);
        const current = await adminFetch(`/draft_orders/${draftId}.json`);
        if (!current.draft_order) return NextResponse.json({ error: 'Cart not found' }, { status: 404 });

        // Merge new lines into existing, incrementing quantity for duplicates
        const existing: any[] = current.draft_order.line_items ?? [];
        const merged = existing.map((li: any) => ({ variant_id: li.variant_id, quantity: li.quantity }));
        for (const nl of lines ?? []) {
          const variantId = extractNumericId(nl.merchandiseId);
          const found = merged.find((m) => m.variant_id === variantId);
          if (found) {
            found.quantity += nl.quantity;
          } else {
            merged.push({ variant_id: variantId, quantity: nl.quantity });
          }
        }

        const data = await adminFetch(`/draft_orders/${draftId}.json`, {
          method: 'PUT',
          body: JSON.stringify({ draft_order: { line_items: merged } }),
        });
        if (!data.draft_order) {
          return NextResponse.json({ error: data.errors ?? 'Failed to update cart' }, { status: 400 });
        }
        return NextResponse.json({ cart: mapDraftOrder(data.draft_order) });
      }

      case 'update': {
        if (!cartId) return NextResponse.json({ error: 'cartId required' }, { status: 400 });
        const draftId = extractNumericId(cartId);
        const current = await adminFetch(`/draft_orders/${draftId}.json`);
        if (!current.draft_order) return NextResponse.json({ error: 'Cart not found' }, { status: 404 });

        const updatedLines = (current.draft_order.line_items ?? [])
          .map((li: any) => {
            const upd = (updateLines ?? []).find((u) => u.id === String(li.id));
            return { variant_id: li.variant_id, quantity: upd ? upd.quantity : li.quantity };
          })
          .filter((li: any) => li.quantity > 0);

        const data = await adminFetch(`/draft_orders/${draftId}.json`, {
          method: 'PUT',
          body: JSON.stringify({ draft_order: { line_items: updatedLines } }),
        });
        if (!data.draft_order) {
          return NextResponse.json({ error: data.errors ?? 'Failed to update cart' }, { status: 400 });
        }
        return NextResponse.json({ cart: mapDraftOrder(data.draft_order) });
      }

      case 'remove': {
        if (!cartId) return NextResponse.json({ error: 'cartId required' }, { status: 400 });
        const draftId = extractNumericId(cartId);
        const current = await adminFetch(`/draft_orders/${draftId}.json`);
        if (!current.draft_order) return NextResponse.json({ error: 'Cart not found' }, { status: 404 });

        const filteredLines = (current.draft_order.line_items ?? [])
          .filter((li: any) => !(lineIds ?? []).includes(String(li.id)))
          .map((li: any) => ({ variant_id: li.variant_id, quantity: li.quantity }));

        const data = await adminFetch(`/draft_orders/${draftId}.json`, {
          method: 'PUT',
          body: JSON.stringify({ draft_order: { line_items: filteredLines } }),
        });
        if (!data.draft_order) {
          return NextResponse.json({ error: data.errors ?? 'Failed to update cart' }, { status: 400 });
        }
        return NextResponse.json({ cart: mapDraftOrder(data.draft_order) });
      }

      case 'get': {
        if (!cartId) return NextResponse.json({ cart: null });
        const draftId = extractNumericId(cartId);
        const data = await adminFetch(`/draft_orders/${draftId}.json`);
        if (!data.draft_order) return NextResponse.json({ cart: null });
        return NextResponse.json({ cart: mapDraftOrder(data.draft_order) });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (err) {
    console.error('Cart API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
