import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import type { ShopifyProduct, ShopifyCart } from './types';
import { GET_PRODUCTS, GET_PRODUCT_BY_HANDLE, GET_CART } from './queries';

function getClient() {
  return createStorefrontApiClient({
    storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? '',
    apiVersion: '2026-01',
    publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN ?? '',
  });
}

export async function getProducts(): Promise<ShopifyProduct[]> {
  if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN) return [];

  const client = getClient();
  const { data, errors } = await client.request(GET_PRODUCTS, {
    variables: { first: 20 },
  });

  if (errors) {
    console.error('Shopify getProducts error:', errors);
    return [];
  }

  return (data?.products?.edges ?? []).map(
    (edge: { node: ShopifyProduct }) => edge.node
  );
}

export async function getProductByHandle(
  handle: string
): Promise<ShopifyProduct | null> {
  if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN) return null;

  const client = getClient();
  const { data, errors } = await client.request(GET_PRODUCT_BY_HANDLE, {
    variables: { handle },
  });

  if (errors) {
    console.error('Shopify getProductByHandle error:', errors);
    return null;
  }

  return data?.productByHandle ?? null;
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN) return null;

  const client = getClient();
  const { data, errors } = await client.request(GET_CART, {
    variables: { cartId },
  });

  if (errors) {
    console.error('Shopify getCart error:', errors);
    return null;
  }

  return data?.cart ?? null;
}

export function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount));
}
