const SHOP = 'tradingalgoss.myshopify.com';
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;

const PRICE_UPDATES = [
  { handle: 'alpha-flow-pro-monthly',       price: '79.00',  compare_at: null },
  { handle: 'alpha-flow-pro-yearly',        price: '599.00', compare_at: '948.00' },
  { handle: 'alpha-flow-elite-monthly',     price: '197.00', compare_at: null },
  { handle: 'trading-psychology-masterclass', price: '297.00', compare_at: '497.00' },
  { handle: 'risk-management-playbook',     price: '67.00',  compare_at: null },
  { handle: 'ai-prompt-pack',               price: '37.00',  compare_at: null },
  { handle: 'starter-bundle',               price: '97.00',  compare_at: '104.00' },
  { handle: 'elite-yearly-masterclass',     price: '799.00', compare_at: '1,093.00' },
];

async function getProducts() {
  const res = await fetch(`https://${SHOP}/admin/api/2026-01/products.json?limit=50&fields=id,handle,variants`, {
    headers: { 'X-Shopify-Access-Token': TOKEN },
  });
  const json = await res.json();
  return json.products ?? [];
}

async function updateVariant(variantId, price, compare_at) {
  const body = { variant: { id: variantId, price } };
  if (compare_at) body.variant.compare_at_price = compare_at;

  const res = await fetch(`https://${SHOP}/admin/api/2026-01/variants/${variantId}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': TOKEN },
    body: JSON.stringify(body),
  });
  return res.ok;
}

async function main() {
  if (!TOKEN) { console.error('Missing SHOPIFY_ADMIN_TOKEN'); process.exit(1); }
  const products = await getProducts();
  const byHandle = Object.fromEntries(products.map(p => [p.handle, p]));

  for (const { handle, price, compare_at } of PRICE_UPDATES) {
    const product = byHandle[handle];
    if (!product) { console.warn('Not found:', handle); continue; }
    const variantId = product.variants[0]?.id;
    if (!variantId) continue;
    const ok = await updateVariant(variantId, price, compare_at);
    console.log(ok ? `Updated ${handle} → $${price}` : `FAILED ${handle}`);
  }
  console.log('\nDone!');
}

main().catch(console.error);
