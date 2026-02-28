const sharp = require('sharp');

const SHOP = 'tradingalgoss.myshopify.com';
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;

// ── SVG templates ─────────────────────────────────────────────────────────────

function baseSvg(icon, title, subtitle, accent = '#06b6d4', badge = null) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#09090b"/>
      <stop offset="100%" style="stop-color:#18181b"/>
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${accent};stop-opacity:0.15"/>
      <stop offset="100%" style="stop-color:${accent};stop-opacity:0.03"/>
    </linearGradient>
    <filter id="blur">
      <feGaussianBlur stdDeviation="60"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="800" fill="url(#bg)"/>

  <!-- Glow orb -->
  <circle cx="600" cy="320" r="350" fill="${accent}" opacity="0.06" filter="url(#blur)"/>

  <!-- Grid lines -->
  <g stroke="#27272a" stroke-width="1" opacity="0.6">
    ${Array.from({length: 12}, (_, i) => `<line x1="${i * 110}" y1="0" x2="${i * 110}" y2="800"/>`).join('')}
    ${Array.from({length: 9}, (_, i) => `<line x1="0" y1="${i * 100}" x2="1200" y2="${i * 100}"/>`).join('')}
  </g>

  <!-- Glow panel -->
  <rect x="300" y="180" width="600" height="440" rx="24" fill="url(#glow)" stroke="${accent}" stroke-width="1" stroke-opacity="0.3"/>

  <!-- Icon circle -->
  <circle cx="600" cy="300" r="72" fill="${accent}" opacity="0.12"/>
  <circle cx="600" cy="300" r="56" fill="${accent}" opacity="0.18"/>

  <!-- Icon -->
  <g transform="translate(600,300)" fill="none" stroke="${accent}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    ${icon}
  </g>

  ${badge ? `
  <!-- Badge -->
  <rect x="${600 - badge.length * 7}" y="188" width="${badge.length * 14 + 24}" height="28" rx="14" fill="${accent}"/>
  <text x="600" y="207" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="13" font-weight="700" fill="#000" letter-spacing="1.5">${badge}</text>
  ` : ''}

  <!-- Title -->
  <text x="600" y="415" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="38" font-weight="800" fill="#fafafa" letter-spacing="-0.5">${title}</text>

  <!-- Subtitle -->
  <text x="600" y="460" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="20" font-weight="400" fill="#71717a">${subtitle}</text>

  <!-- Brand -->
  <text x="600" y="580" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="15" font-weight="600" fill="${accent}" letter-spacing="3" opacity="0.7">ALPHA FLOW</text>
</svg>`.trim();
}

// ── Icons ─────────────────────────────────────────────────────────────────────

const ICONS = {
  chart: `<polyline points="-28,14 -10,-14 8,6 28,-24" stroke-width="3"/>
          <line x1="-28" y1="22" x2="28" y2="22" stroke-width="2" opacity="0.4"/>`,

  crown: `<path d="M-28,14 L-18,-18 L0,6 L18,-18 L28,14 Z"/>
          <line x1="-28" y1="18" x2="28" y2="18" stroke-width="3"/>
          <circle cx="-18" cy="-20" r="3" fill="#a78bfa"/>
          <circle cx="0" cy="4" r="3" fill="#a78bfa"/>
          <circle cx="18" cy="-20" r="3" fill="#a78bfa"/>`,

  brain: `<path d="M0,-24 C16,-24 28,-14 28,0 C28,10 22,18 14,22 C14,22 8,26 0,26 C-8,26 -14,22 -14,22 C-22,18 -28,10 -28,0 C-28,-14 -16,-24 0,-24"/>
          <line x1="0" y1="-24" x2="0" y2="26" stroke-width="2" opacity="0.5"/>
          <path d="M0,-8 C6,-8 12,-4 14,2" stroke-width="2" opacity="0.6"/>
          <path d="M0,6 C-6,6 -12,2 -14,-4" stroke-width="2" opacity="0.6"/>`,

  shield: `<path d="M0,-26 L24,-14 L24,4 C24,16 14,24 0,28 C-14,24 -24,16 -24,4 L-24,-14 Z"/>
           <polyline points="-10,2 -2,10 12,-8" stroke-width="3"/>`,

  zap: `<polygon points="6,-26 -10,2 4,2 -6,26 14,-4 0,-4 12,-26"/>`,

  // Journal: notebook/book icon
  journal: `<rect x="-22" y="-26" width="44" height="52" rx="4"/>
            <line x1="-22" y1="-10" x2="22" y2="-10" stroke-width="2" opacity="0.5"/>
            <line x1="-22" y1="4" x2="22" y2="4" stroke-width="2" opacity="0.5"/>
            <line x1="-22" y1="18" x2="10" y2="18" stroke-width="2" opacity="0.5"/>
            <line x1="-28" y1="-20" x2="-28" y2="20" stroke-width="4"/>`,

  // Calculator: grid icon
  calculator: `<rect x="-24" y="-26" width="48" height="52" rx="6"/>
               <rect x="-16" y="-18" width="32" height="14" rx="3" fill="none" stroke-width="2"/>
               <circle cx="-12" cy="4" r="3" fill="none" stroke-width="2"/>
               <circle cx="0" cy="4" r="3" fill="none" stroke-width="2"/>
               <circle cx="12" cy="4" r="3" fill="none" stroke-width="2"/>
               <circle cx="-12" cy="18" r="3" fill="none" stroke-width="2"/>
               <circle cx="0" cy="18" r="3" fill="none" stroke-width="2"/>
               <circle cx="12" cy="18" r="3" fill="none" stroke-width="2"/>`,

  // Price action: candlestick chart
  candles: `<line x1="-20" y1="-26" x2="-20" y2="26" stroke-width="2" opacity="0.5"/>
            <rect x="-26" y="-14" width="12" height="20" rx="2"/>
            <line x1="0" y1="-26" x2="0" y2="26" stroke-width="2" opacity="0.5"/>
            <rect x="-6" y="-18" width="12" height="26" rx="2"/>
            <line x1="20" y1="-20" x2="20" y2="22" stroke-width="2" opacity="0.5"/>
            <rect x="14" y="-8" width="12" height="16" rx="2"/>`,

  // Gap and go: rocket/arrow launch
  rocket: `<path d="M0,-28 C8,-28 22,-16 22,0 C22,14 14,22 0,26 C-14,22 -22,14 -22,0 C-22,-16 -8,-28 0,-28"/>
           <circle cx="0" cy="0" r="8"/>
           <path d="M-22,10 L-30,24 L-14,20 Z" opacity="0.6"/>
           <path d="M22,10 L30,24 L14,20 Z" opacity="0.6"/>`,

  // Bundle: 4 squares
  bundle: `<rect x="-24" y="-24" width="20" height="20" rx="3"/>
           <rect x="4" y="-24" width="20" height="20" rx="3"/>
           <rect x="-24" y="4" width="20" height="20" rx="3"/>
           <rect x="4" y="4" width="20" height="20" rx="3"/>`,
};

// ── Product definitions ───────────────────────────────────────────────────────

const PRODUCT_IMAGES = [
  {
    handle: 'alpha-flow-free',
    icon: ICONS.zap,
    title: 'Alpha Flow Free',
    subtitle: 'Start trading smarter — no cost',
    accent: '#71717a',
    badge: 'FREE',
  },
  {
    handle: 'alpha-flow-pro-monthly',
    icon: ICONS.chart,
    title: 'Alpha Flow Pro',
    subtitle: 'Unlimited AI signals · Monthly',
    accent: '#06b6d4',
    badge: 'PRO',
  },
  {
    handle: 'alpha-flow-pro-yearly',
    icon: ICONS.chart,
    title: 'Alpha Flow Pro',
    subtitle: 'Unlimited AI signals · Best Value',
    accent: '#06b6d4',
    badge: 'SAVE 32%',
  },
  {
    handle: 'alpha-flow-elite-monthly',
    icon: ICONS.crown,
    title: 'Alpha Flow Elite',
    subtitle: 'Professional trading suite',
    accent: '#a78bfa',
    badge: 'ELITE',
  },
  {
    handle: 'trading-psychology-masterclass',
    icon: ICONS.brain,
    title: 'Psychology Masterclass',
    subtitle: 'Master your trading mindset',
    accent: '#f59e0b',
    badge: 'COURSE',
  },
  {
    handle: 'risk-management-playbook',
    icon: ICONS.shield,
    title: 'Risk Management',
    subtitle: 'Position sizing · Stop losses · Drawdown',
    accent: '#10b981',
    badge: 'PLAYBOOK',
  },
  {
    handle: 'day-trading-journal-template',
    icon: ICONS.journal,
    title: 'Trading Journal',
    subtitle: 'Google Sheets · Track every trade',
    accent: '#22c55e',
    badge: 'TEMPLATE',
  },
  {
    handle: 'position-sizing-calculator',
    icon: ICONS.calculator,
    title: 'Position Sizing',
    subtitle: 'Google Sheets · Risk calculator',
    accent: '#3b82f6',
    badge: 'CALCULATOR',
  },
  {
    handle: 'price-action-setup-guide',
    icon: ICONS.candles,
    title: 'Price Action Guide',
    subtitle: '20+ setups · Entries, stops &amp; targets',
    accent: '#f97316',
    badge: 'PDF GUIDE',
  },
  {
    handle: 'gap-and-go-strategy-playbook',
    icon: ICONS.rocket,
    title: 'Gap &amp; Go Playbook',
    subtitle: 'Morning gaps · Momentum strategy',
    accent: '#ec4899',
    badge: 'PLAYBOOK',
  },
  {
    handle: 'complete-trader-toolkit',
    icon: ICONS.bundle,
    title: 'Complete Trader Toolkit',
    subtitle: 'Journal + Calculator + 2 Guides · Save $73',
    accent: '#f59e0b',
    badge: 'BEST VALUE',
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

async function svgToPngBase64(svgString) {
  const buf = await sharp(Buffer.from(svgString)).png().toBuffer();
  return buf.toString('base64');
}

async function getProducts() {
  const res = await fetch(`https://${SHOP}/admin/api/2026-01/products.json?limit=50&fields=id,handle,title`, {
    headers: { 'X-Shopify-Access-Token': TOKEN },
  });
  const json = await res.json();
  return json.products ?? [];
}

async function uploadImage(productId, base64, filename) {
  const res = await fetch(`https://${SHOP}/admin/api/2026-01/products/${productId}/images.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': TOKEN,
    },
    body: JSON.stringify({ image: { attachment: base64, filename } }),
  });
  const json = await res.json();
  if (!res.ok) {
    console.error('Upload failed:', JSON.stringify(json.errors));
    return false;
  }
  return true;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!TOKEN) { console.error('Missing SHOPIFY_ADMIN_TOKEN'); process.exit(1); }

  console.log('Fetching products...');
  const products = await getProducts();
  const byHandle = Object.fromEntries(products.map(p => [p.handle, p]));

  for (const def of PRODUCT_IMAGES) {
    const product = byHandle[def.handle];
    if (!product) { console.warn(`  Skipping (not found): ${def.handle}`); continue; }

    process.stdout.write(`  Uploading "${def.title}"... `);
    const svg = baseSvg(def.icon, def.title, def.subtitle, def.accent, def.badge);
    const base64 = await svgToPngBase64(svg);
    const ok = await uploadImage(product.id, base64, `${def.handle}.png`);
    console.log(ok ? 'done' : 'FAILED');
  }

  console.log('\nDone! Images are live in Shopify.');
}

main().catch(console.error);
