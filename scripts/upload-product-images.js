const sharp = require('sharp');

const SHOP = 'tradingalgoss.myshopify.com';
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;

// ── SVG templates ────────────────────────────────────────────────────────────

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

// ── Icons ────────────────────────────────────────────────────────────────────

const ICONS = {
  chart: `<polyline points="-28,14 -10,-14 8,6 28,-24" stroke-width="3"/>
          <line x1="-28" y1="22" x2="28" y2="22" stroke-width="2" opacity="0.4"/>`,

  crown: `<path d="M-28,14 L-18,-18 L0,6 L18,-18 L28,14 Z"/>
          <line x1="-28" y1="18" x2="28" y2="18" stroke-width="3"/>
          <circle cx="-18" cy="-20" r="3" fill="#06b6d4"/>
          <circle cx="0" cy="4" r="3" fill="#06b6d4"/>
          <circle cx="18" cy="-20" r="3" fill="#06b6d4"/>`,

  brain: `<path d="M0,-24 C16,-24 28,-14 28,0 C28,10 22,18 14,22 C14,22 8,26 0,26 C-8,26 -14,22 -14,22 C-22,18 -28,10 -28,0 C-28,-14 -16,-24 0,-24"/>
          <line x1="0" y1="-24" x2="0" y2="26" stroke-width="2" opacity="0.5"/>
          <path d="M0,-8 C6,-8 12,-4 14,2" stroke-width="2" opacity="0.6"/>
          <path d="M0,6 C-6,6 -12,2 -14,-4" stroke-width="2" opacity="0.6"/>`,

  shield: `<path d="M0,-26 L24,-14 L24,4 C24,16 14,24 0,28 C-14,24 -24,16 -24,4 L-24,-14 Z"/>
           <polyline points="-10,2 -2,10 12,-8" stroke-width="3"/>`,

  chat: `<path d="M-24,-20 L24,-20 L24,8 L8,8 L0,22 L-8,8 L-24,8 Z" stroke-width="2.5"/>
         <line x1="-14" y1="-8" x2="14" y2="-8" stroke-width="2.5" opacity="0.6"/>
         <line x1="-14" y1="0" x2="6" y2="0" stroke-width="2.5" opacity="0.6"/>`,

  package: `<path d="M0,-26 L24,-14 L24,14 L0,26 L-24,14 L-24,-14 Z"/>
            <line x1="0" y1="-26" x2="0" y2="26" stroke-width="2" opacity="0.5"/>
            <line x1="-24" y1="-14" x2="24" y2="-14" stroke-width="2" opacity="0.5"/>
            <path d="M-12,-20 L12,-8" stroke-width="2.5" opacity="0.7"/>`,

  zap: `<polygon points="6,-26 -10,2 4,2 -6,26 14,-4 0,-4 12,-26"/>`,
};

// ── Product definitions ───────────────────────────────────────────────────────

const PRODUCT_IMAGES = [
  { handle: 'alpha-flow-free',              icon: ICONS.zap,     title: 'Alpha Flow Free',         subtitle: 'Start trading smarter — no cost',         accent: '#71717a', badge: 'FREE' },
  { handle: 'alpha-flow-pro-monthly',       icon: ICONS.chart,   title: 'Alpha Flow Pro',           subtitle: 'Unlimited signals · Monthly',              accent: '#06b6d4', badge: 'PRO' },
  { handle: 'alpha-flow-pro-yearly',        icon: ICONS.chart,   title: 'Alpha Flow Pro',           subtitle: 'Unlimited signals · Best Value',           accent: '#06b6d4', badge: 'SAVE 32%' },
  { handle: 'alpha-flow-elite-monthly',     icon: ICONS.crown,   title: 'Alpha Flow Elite',         subtitle: 'Professional trading suite',               accent: '#a78bfa', badge: 'ELITE' },
  { handle: 'trading-psychology-masterclass', icon: ICONS.brain, title: 'Psychology Masterclass',  subtitle: 'Master your trading mindset',              accent: '#f59e0b', badge: 'COURSE' },
  { handle: 'risk-management-playbook',     icon: ICONS.shield,  title: 'Risk Management',          subtitle: 'Position sizing · Stop losses · Drawdown', accent: '#10b981', badge: 'PLAYBOOK' },
  { handle: 'ai-prompt-pack',               icon: ICONS.chat,    title: 'AI Prompt Pack',           subtitle: '50 prompts for disciplined trading',       accent: '#06b6d4', badge: 'PROMPTS' },
  { handle: 'starter-bundle',               icon: ICONS.package, title: 'Starter Bundle',           subtitle: 'Playbook + Prompt Pack · Save $7',         accent: '#f59e0b', badge: 'BUNDLE' },
  { handle: 'elite-yearly-masterclass',     icon: ICONS.crown,   title: 'Elite Bundle',             subtitle: 'Elite Yearly + Masterclass · Save $47',   accent: '#a78bfa', badge: 'BEST VALUE' },
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
    console.error('Upload failed:', json.errors);
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
    if (!product) { console.warn('Not found:', def.handle); continue; }

    process.stdout.write(`Generating image for "${def.title}"... `);
    const svg = baseSvg(def.icon, def.title, def.subtitle, def.accent, def.badge);
    const base64 = await svgToPngBase64(svg);
    const ok = await uploadImage(product.id, base64, `${def.handle}.png`);
    console.log(ok ? 'done' : 'FAILED');
  }

  console.log('\nAll done! Refresh your Shopify admin to see the images.');
}

main().catch(console.error);
