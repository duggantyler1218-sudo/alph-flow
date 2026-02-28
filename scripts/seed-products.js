const SHOP = 'tradingalgoss.myshopify.com';
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;

async function createProduct(data) {
  const res = await fetch(`https://${SHOP}/admin/api/2025-01/products.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': TOKEN,
    },
    body: JSON.stringify({ product: data }),
  });
  const json = await res.json();
  if (!res.ok) {
    console.error('Failed:', data.title, json.errors);
    return null;
  }
  console.log('Created:', json.product.title, '→', json.product.handle);
  return json.product;
}

const products = [
  {
    title: 'Alpha Flow Free',
    handle: 'alpha-flow-free',
    body_html: '<p>Start trading smarter for free. Alpha Flow Free gives you 3 AI-powered trade signals per day, basic multi-market analysis, and limited access to the AI trading assistant. No credit card required.</p>',
    product_type: 'Service',
    status: 'active',
    variants: [{ price: '0.00', requires_shipping: false, taxable: false }],
  },
  {
    title: 'Alpha Flow Pro — Monthly',
    handle: 'alpha-flow-pro-monthly',
    body_html: '<p>Unlock the full Alpha Flow platform. Get unlimited AI trade signals across equities, crypto, and forex — plus multi-timeframe analysis, risk management alerts, portfolio optimization, and full access to the AI trading assistant and discipline coach. Cancel anytime.</p>',
    product_type: 'Service',
    status: 'active',
    variants: [{ price: '49.00', requires_shipping: false, taxable: false }],
  },
  {
    title: 'Alpha Flow Pro — Yearly',
    handle: 'alpha-flow-pro-yearly',
    body_html: '<p>Everything in Alpha Flow Pro, billed annually. Save 32% compared to monthly — that\'s 2 months free. Includes unlimited signals, AI assistant, discipline coach, risk management, and priority support.</p>',
    product_type: 'Service',
    status: 'active',
    variants: [{ price: '399.00', compare_at_price: '588.00', requires_shipping: false, taxable: false }],
  },
  {
    title: 'Alpha Flow Elite — Monthly',
    handle: 'alpha-flow-elite-monthly',
    body_html: '<p>The complete professional trading suite. Everything in Pro plus 24/7 priority support, a custom risk rule engine, advanced portfolio tracking, and dedicated 1-on-1 AI coach sessions. Built for serious traders who refuse to lose to their own emotions.</p>',
    product_type: 'Service',
    status: 'active',
    variants: [{ price: '149.00', requires_shipping: false, taxable: false }],
  },
  {
    title: 'Trading Psychology Masterclass',
    handle: 'trading-psychology-masterclass',
    body_html: '<p>12 in-depth video modules covering the psychology behind consistent trading. Learn how to eliminate FOMO, stop revenge trading, build a personal trade plan, and develop the emotional control that separates profitable traders from the rest. Lifetime access included.</p>',
    product_type: 'Digital',
    status: 'active',
    variants: [{ price: '197.00', requires_shipping: false, taxable: false }],
  },
  {
    title: 'Risk Management Playbook',
    handle: 'risk-management-playbook',
    body_html: '<p>The complete risk management guide for active traders. Covers position sizing formulas, stop loss strategies, max drawdown rules, and risk/reward frameworks. Instant PDF download — apply the principles to your next trade today.</p>',
    product_type: 'Digital',
    status: 'active',
    variants: [{ price: '47.00', requires_shipping: false, taxable: false }],
  },
  {
    title: 'AI Prompt Pack for Traders',
    handle: 'ai-prompt-pack',
    body_html: '<p>50 battle-tested prompts designed to get the most out of Alpha Flow\'s AI coach and assistant. Includes pre-trade checklists, end-of-day review templates, risk calculation prompts, and mindset reset scripts. Instant access after purchase.</p>',
    product_type: 'Digital',
    status: 'active',
    variants: [{ price: '27.00', requires_shipping: false, taxable: false }],
  },
  {
    title: 'Starter Bundle',
    handle: 'starter-bundle',
    body_html: '<p>The Risk Management Playbook + AI Prompt Pack in one discounted bundle. Everything you need to trade with discipline from day one. Save $7 vs buying separately. Instant access to both products.</p>',
    product_type: 'Digital',
    status: 'active',
    variants: [{ price: '67.00', compare_at_price: '74.00', requires_shipping: false, taxable: false }],
  },
  {
    title: 'Elite Yearly + Masterclass',
    handle: 'elite-yearly-masterclass',
    body_html: '<p>The ultimate Alpha Flow package. Includes Alpha Flow Elite (yearly subscription) + the Trading Psychology Masterclass. Save $47 vs buying separately. The complete toolkit for traders serious about turning consistent discipline into consistent profits.</p>',
    product_type: 'Digital',
    status: 'active',
    variants: [{ price: '499.00', compare_at_price: '546.00', requires_shipping: false, taxable: false }],
  },
];

async function main() {
  if (!TOKEN) {
    console.error('Missing SHOPIFY_ADMIN_TOKEN');
    process.exit(1);
  }
  console.log(`Seeding ${products.length} products to ${SHOP}...\n`);
  for (const p of products) {
    await createProduct(p);
  }
  console.log('\nDone!');
}

main();
