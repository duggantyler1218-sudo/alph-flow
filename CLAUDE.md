# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

**Alpha Flow** is a Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 app. It's an AI-powered trading assistant with a headless Shopify storefront selling subscription plans.

### App Router Structure

```
app/
├── layout.tsx                  # Root layout — Geist fonts, CartProvider, Nav, CartDrawer
├── page.tsx                    # Marketing landing page (hero, features, pricing preview, CTA)
├── globals.css                 # Tailwind imports + CSS variables (zinc/cyan dark theme)
├── chat/page.tsx               # Main chat UI (client component)
├── store/
│   ├── page.tsx                # Pricing/product listing page (RSC — fetches from Shopify)
│   └── [handle]/page.tsx       # Product detail page (RSC)
└── api/
    ├── chat/route.ts           # OpenClaw AI proxy (streaming SSE)
    └── shopify/
        └── cart/route.ts       # Server-side cart mutations (create/add/update/remove/get)

lib/shopify/
├── client.ts     # createStorefrontApiClient singleton + helper functions
├── queries.ts    # All GraphQL queries and mutations
└── types.ts      # TypeScript types for Shopify entities

components/
├── nav.tsx                       # Top nav with cart badge (client)
├── cart-provider.tsx             # CartContext + useCart hook (client)
├── cart-drawer.tsx               # Slide-out cart panel (client)
└── store/
    ├── product-card.tsx          # Product card for pricing page (server)
    └── add-to-cart-button.tsx    # Add-to-cart with loading/added states (client)
```

### Data Flow — Chat

The chat UI (`app/chat/page.tsx`) sends `POST /api/chat` with `{messages, sessionId}`. The API route proxies this to OpenClaw with `stream: true`. The SSE response is piped back to the frontend, which parses `data: {json}` chunks in real time.

### Data Flow — Store

```
Shopify Admin (products) → Shopify Storefront GraphQL API
  ↓
lib/shopify/client.ts (createStorefrontApiClient, API version 2025-01)
  ↓
Server Components (app/store/*.tsx) — catalog fetched at build/request time
  ↓
CartProvider (cart-provider.tsx) — cartId persisted to localStorage
  ↓
/api/shopify/cart — server-side mutations to avoid CORS
  ↓
cart.checkoutUrl → redirect to Shopify hosted checkout
```

### Environment Variables

**AI chat:**
- `OPENCLAW_URL` — base URL of the OpenClaw AI backend
- `OPENCLAW_AGENT_ID` — agent ID (defaults to `"main"`)

**Shopify store:**
- `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` — e.g. `your-store.myshopify.com`
- `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN` — public Storefront API access token

### Key Patterns

- **Streaming**: API route uses `Response` with `ReadableStream`; frontend reads via `response.body.getReader()`.
- **Tailwind dark mode**: zinc-based color palette with cyan-500 accent throughout.
- **Shopify products fetched server-side** in RSC — no client-side catalog fetching.
- **Cart mutations via Next.js API route** (`/api/shopify/cart`) to avoid CORS.
- **Checkout = redirect to Shopify hosted checkout** — never rebuild checkout.
- Path alias `@/` maps to the project root.

### Shopify Setup (one-time)

1. Create Shopify store → Admin → Apps → Develop apps → create app with Storefront API scopes:
   `unauthenticated_read_product_listings`, `unauthenticated_read_product_inventory`,
   `unauthenticated_write_checkouts`, `unauthenticated_write_customers`
2. Create two Service products (no shipping):
   - "Alpha Flow Pro — Monthly" (SKU: `af-monthly`)
   - "Alpha Flow Pro — Yearly" (SKU: `af-yearly`)
3. Add env vars to `.env.local` (see above)
