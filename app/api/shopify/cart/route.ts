import { NextRequest, NextResponse } from 'next/server';
import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import {
  CART_CREATE,
  CART_LINES_ADD,
  CART_LINES_UPDATE,
  CART_LINES_REMOVE,
  GET_CART,
} from '@/lib/shopify/queries';
import type { CartLineInput, CartLineUpdateInput } from '@/lib/shopify/types';

type CartAction = 'create' | 'add' | 'update' | 'remove' | 'get';

interface CartRequestBody {
  action: CartAction;
  cartId?: string;
  lines?: CartLineInput[];
  updateLines?: CartLineUpdateInput[];
  lineIds?: string[];
}

function getClient() {
  return createStorefrontApiClient({
    storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? '',
    apiVersion: '2025-01',
    publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN ?? '',
  });
}

export async function POST(request: NextRequest) {
  const body: CartRequestBody = await request.json();
  const { action, cartId, lines, updateLines, lineIds } = body;

  if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN) {
    return NextResponse.json(
      { error: 'Shopify store not configured' },
      { status: 503 }
    );
  }

  const client = getClient();

  try {
    switch (action) {
      case 'create': {
        const { data, errors } = await client.request(CART_CREATE, {
          variables: { lines: lines ?? [] },
        });
        if (errors) return NextResponse.json({ error: errors }, { status: 400 });
        return NextResponse.json({ cart: data?.cartCreate?.cart });
      }

      case 'add': {
        if (!cartId) return NextResponse.json({ error: 'cartId required' }, { status: 400 });
        const { data, errors } = await client.request(CART_LINES_ADD, {
          variables: { cartId, lines: lines ?? [] },
        });
        if (errors) return NextResponse.json({ error: errors }, { status: 400 });
        return NextResponse.json({ cart: data?.cartLinesAdd?.cart });
      }

      case 'update': {
        if (!cartId) return NextResponse.json({ error: 'cartId required' }, { status: 400 });
        const { data, errors } = await client.request(CART_LINES_UPDATE, {
          variables: { cartId, lines: updateLines ?? [] },
        });
        if (errors) return NextResponse.json({ error: errors }, { status: 400 });
        return NextResponse.json({ cart: data?.cartLinesUpdate?.cart });
      }

      case 'remove': {
        if (!cartId) return NextResponse.json({ error: 'cartId required' }, { status: 400 });
        const { data, errors } = await client.request(CART_LINES_REMOVE, {
          variables: { cartId, lineIds: lineIds ?? [] },
        });
        if (errors) return NextResponse.json({ error: errors }, { status: 400 });
        return NextResponse.json({ cart: data?.cartLinesRemove?.cart });
      }

      case 'get': {
        if (!cartId) return NextResponse.json({ error: 'cartId required' }, { status: 400 });
        const { data, errors } = await client.request(GET_CART, {
          variables: { cartId },
        });
        if (errors) return NextResponse.json({ error: errors }, { status: 400 });
        return NextResponse.json({ cart: data?.cart });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (err) {
    console.error('Cart API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
