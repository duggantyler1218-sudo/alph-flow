import type { ShopifyProduct, ShopifyCart } from './types';

const SHOP = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? '';
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN ?? '';
const API = '2026-01';

async function adminFetch(path: string) {
  const res = await fetch(`https://${SHOP}/admin/api/${API}${path}`, {
    headers: { 'X-Shopify-Access-Token': ADMIN_TOKEN },
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

// Map Admin API product format → ShopifyProduct type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(p: any): ShopifyProduct {
  const variant = p.variants?.[0];
  return {
    id: `gid://shopify/Product/${p.id}`,
    title: p.title,
    handle: p.handle,
    description: p.body_html?.replace(/<[^>]+>/g, '') ?? '',
    descriptionHtml: p.body_html ?? '',
    productType: p.product_type ?? '',
    featuredImage: p.image
      ? { url: p.image.src, altText: p.image.alt ?? null }
      : null,
    priceRange: {
      minVariantPrice: { amount: variant?.price ?? '0', currencyCode: 'USD' },
      maxVariantPrice: { amount: variant?.price ?? '0', currencyCode: 'USD' },
    },
    variants: {
      edges: (p.variants ?? []).map((v: any) => ({
        node: {
          id: `gid://shopify/ProductVariant/${v.id}`,
          title: v.title,
          sku: v.sku ?? null,
          price: { amount: v.price, currencyCode: 'USD' },
          compareAtPrice: v.compare_at_price
            ? { amount: v.compare_at_price, currencyCode: 'USD' }
            : null,
          availableForSale: v.inventory_policy !== 'deny' || (v.inventory_quantity ?? 1) > 0,
        },
      })),
    },
  };
}

export async function getProducts(): Promise<ShopifyProduct[]> {
  if (!SHOP || !ADMIN_TOKEN) return [];
  const json = await adminFetch('/products.json?limit=50&status=active');
  if (!json?.products) return [];
  return json.products.map(mapProduct);
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  if (!SHOP || !ADMIN_TOKEN) return null;
  const json = await adminFetch(`/products.json?handle=${handle}&limit=1`);
  const p = json?.products?.[0];
  return p ? mapProduct(p) : null;
}

export async function getCart(_cartId: string): Promise<ShopifyCart | null> {
  return null;
}

export function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount));
}
