import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductByHandle, getProducts, formatPrice } from '@/lib/shopify/client';
import { AddToCartButton } from '@/components/store/add-to-cart-button';
import type { Metadata } from 'next';
import type { ShopifyProduct } from '@/lib/shopify/types';

interface Params {
  params: Promise<{ handle: string }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) return { title: 'Product Not Found — Alpha Flow' };
  return {
    title: `${product.title} — Alpha Flow`,
    description: product.description?.slice(0, 155) || `Get ${product.title} from Alpha Flow — the AI-native trading platform.`,
  };
}

// ── Per-product rich content ────────────────────────────────────────────────

interface ProductContent {
  badge: string;
  badgeColor: string;
  billingLabel: string;
  ctaLabel: string;
  features: string[];
  whatYouGet: { heading: string; body: string }[];
  whoIsItFor: string[];
  faq: { q: string; a: string }[];
  previewType: 'signals' | 'journal' | 'calculator' | 'guide' | 'bundle';
}

function getProductContent(handle: string, title: string): ProductContent {
  const h = handle.toLowerCase();

  // ── Subscriptions ────────────────────────────────────────────────────────

  if (h.includes('elite')) {
    const yearly = h.includes('yearly') || h.includes('annual');
    return {
      badge: 'Elite Plan', badgeColor: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
      billingLabel: yearly ? '/ year' : '/ month',
      ctaLabel: yearly ? 'Get Elite Annual' : 'Get Elite Monthly',
      features: [
        'Everything in Pro, plus:',
        'Priority 24/7 support',
        'Custom risk rule engine',
        'Advanced portfolio tracking',
        '1-on-1 AI coach sessions',
        'Dedicated account manager',
        ...(yearly ? ['2 months free vs monthly', 'Lock in current pricing'] : []),
      ],
      whatYouGet: [
        { heading: 'Unlimited AI Signals', body: 'Real-time LONG/SHORT/HOLD signals across crypto, equities, and futures — with confidence scores, RSI, EMA crossovers, and a plain-English reason for every call.' },
        { heading: 'AI Trading Assistant', body: 'Ask anything about the markets, a specific setup, or your own trade history. The assistant understands context and gives actionable, nuanced answers — not generic responses.' },
        { heading: 'AI Discipline Coach', body: 'The only platform with a built-in trading psychology coach. Run pre-trade checklists, end-of-day reviews, position sizing sessions, and overtrading checks.' },
        { heading: 'Custom Risk Rule Engine', body: 'Define your personal trading rules and have the AI enforce them. Set max daily loss, max position size, max trades per day — and get flagged when you\'re about to break them.' },
        { heading: '1-on-1 AI Coach Sessions', body: 'Deep-dive sessions with the AI coach reviewing your specific trade history, patterns in your mistakes, and a personalised plan to fix your biggest weaknesses.' },
      ],
      whoIsItFor: [
        'Full-time or near-full-time traders',
        'Traders with accounts over $25k',
        'Anyone serious about removing emotional trading decisions',
        'Traders who want maximum AI support across every part of their process',
      ],
      faq: [
        { q: 'What\'s the difference between Elite and Pro?', a: 'Elite adds a custom risk rule engine, 1-on-1 AI coach sessions, priority support, and advanced portfolio tracking. Pro is excellent for most traders — Elite is for those who want the full professional setup.' },
        { q: 'Can I switch from monthly to yearly?', a: 'Yes, anytime. We\'ll credit your remaining monthly days toward the annual plan.' },
        { q: 'Is there a contract?', a: 'No. Cancel anytime from your account dashboard. Annual plans are refundable within 30 days.' },
      ],
      previewType: 'signals',
    };
  }

  if (h.includes('pro') || h.includes('monthly') || h.includes('yearly') || h.includes('annual')) {
    const yearly = h.includes('yearly') || h.includes('annual');
    return {
      badge: 'Pro Plan', badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
      billingLabel: yearly ? '/ year' : '/ month',
      ctaLabel: yearly ? 'Get Pro Annual — Best Value' : 'Get Pro Monthly',
      features: [
        'Unlimited AI trade signals',
        'Crypto, equities & futures coverage',
        'RSI, EMA, SMA multi-indicator analysis',
        'AI Trading Assistant (unlimited)',
        'AI Discipline Coach (unlimited)',
        'Real-time signal dashboard',
        'Risk management alerts',
        ...(yearly ? ['Priority support', '2 months free vs monthly', 'Lock in current pricing'] : []),
      ],
      whatYouGet: [
        { heading: 'Live Market Signal Dashboard', body: 'Every 20 seconds, Alpha Flow analyzes 10+ assets across crypto (BTC, ETH, SOL), equities (SPY, QQQ, AAPL, NVDA, TSLA) and futures (ES=F, NQ=F) — and gives you a clear LONG/SHORT/HOLD signal with a confidence score and reason.' },
        { heading: 'AI Trading Assistant', body: 'Ask anything about markets, setups, or strategy. The assistant has deep context about your signals and market conditions. No scripted responses — real, contextual answers to your specific questions.' },
        { heading: 'AI Discipline Coach', body: 'The feature that sets Alpha Flow apart. Run a pre-trade checklist before entering a position. Do an end-of-day review of your trades. Get real-time help calculating correct position sizes. Stop revenge trading and FOMO for good.' },
        { heading: 'Multi-Indicator Signal Engine', body: 'Every signal is backed by RSI(14), EMA 9/21 crossover, SMA20 price comparison, and 24-hour momentum — weighted and combined into a single, clear recommendation with confidence percentage.' },
      ],
      whoIsItFor: [
        'Active day traders and swing traders',
        'Traders who want AI-powered analysis without building it themselves',
        'Anyone who has struggled with overtrading, revenge trading, or FOMO',
        'Traders looking to move from discretionary to systematic decision-making',
      ],
      faq: [
        { q: 'How often do signals update?', a: 'Every 20 seconds. Data is sourced from CoinGecko (crypto) and Yahoo Finance (stocks/futures) in real time.' },
        { q: 'Is this financial advice?', a: 'No. Signals are algorithmic and informational only. Always apply your own judgment and risk rules.' },
        { q: 'Can I cancel anytime?', a: 'Yes. Cancel from your account at any time. No questions asked. Annual plans are refundable within 30 days.' },
        { q: 'What markets are covered?', a: 'BTC, ETH, SOL, SPY, QQQ, AAPL, NVDA, TSLA, S&P 500 Futures (ES=F), and Nasdaq Futures (NQ=F) — with more being added.' },
      ],
      previewType: 'signals',
    };
  }

  if (h.includes('free')) {
    return {
      badge: 'Free Forever', badgeColor: 'text-zinc-400 border-zinc-700 bg-zinc-800/40',
      billingLabel: '',
      ctaLabel: 'Get Started Free',
      features: [
        '3 AI signals per day',
        'Basic market analysis',
        'AI assistant (10 messages/day)',
        'Community access',
        'No credit card required',
      ],
      whatYouGet: [
        { heading: '3 Daily AI Signals', body: 'Get three real signal reads per day — complete with direction, confidence score, RSI, and trend.' },
        { heading: 'AI Assistant (10 messages/day)', body: 'Ask the trading assistant up to 10 questions per day. Enough to get answers on setups, market conditions, and strategy basics.' },
        { heading: 'Community Access', body: 'Join the Alpha Flow community of active traders sharing setups, ideas, and results.' },
      ],
      whoIsItFor: ['Traders new to AI-powered analysis', 'Anyone wanting to try Alpha Flow before subscribing'],
      faq: [
        { q: 'Is it really free forever?', a: 'Yes. No credit card, no trial period, no hidden fees. The free plan stays free.' },
        { q: 'What happens if I want more signals?', a: 'Upgrade to Pro at any time for unlimited signals, the full AI assistant, and the discipline coach.' },
      ],
      previewType: 'signals',
    };
  }

  // ── One-time products ────────────────────────────────────────────────────

  if (h.includes('journal')) {
    return {
      badge: 'Google Sheets Template', badgeColor: 'text-green-400 border-green-500/30 bg-green-500/10',
      billingLabel: 'one-time',
      ctaLabel: 'Download the Journal — $29',
      features: [
        'Automatic P&L tracking per trade',
        'Win rate, avg R:R, drawdown dashboard',
        'Daily, weekly & monthly views',
        'Emotional state & mistake tracker',
        'Strategy tag system (filter by setup)',
        'Works on Google Sheets — any device',
        'Instant access after purchase',
        'Free updates for life',
      ],
      whatYouGet: [
        { heading: 'Automatic P&L Tracking', body: 'Enter your entry, exit, shares, and fees — the journal calculates your net P&L, commission drag, and running account balance automatically. No manual math.' },
        { heading: 'Performance Dashboard', body: 'See your win rate, average winner vs average loser, profit factor, and max drawdown at a glance — updated every time you log a trade. Know exactly where your edge is (and isn\'t).' },
        { heading: 'Emotional State & Mistake Log', body: 'The column most traders skip — but the one that makes the biggest difference. Log your emotional state before each trade and the mistake type (if any). Within weeks, patterns become obvious.' },
        { heading: 'Strategy Tag System', body: 'Tag every trade with the setup type (gap and go, breakout, reversal, etc.) and filter your results by tag. Find out which setups actually make you money and which ones drain your account.' },
        { heading: 'Weekly & Monthly Views', body: 'Automatically populated weekly and monthly summary tabs show your best/worst days, your consistency score, and whether you\'re improving over time.' },
      ],
      whoIsItFor: [
        'Day traders and swing traders at any level',
        'Traders who know they should be journaling but haven\'t found a system that sticks',
        'Anyone serious about identifying and fixing patterns in their trading mistakes',
        'Traders who want to understand exactly which setups are profitable',
      ],
      faq: [
        { q: 'Do I need to know how to use Google Sheets?', a: 'No. You only need to fill in the yellow input columns — everything else is automated. Step-by-step setup instructions are included.' },
        { q: 'Can I use it on mobile?', a: 'Yes. Google Sheets works on any device through the free Google Sheets app.' },
        { q: 'Will I get updates?', a: 'Yes. Every future version of the template is included at no extra cost — just re-download from your account.' },
        { q: 'Can I customise it?', a: 'Absolutely. The sheet is fully unlocked — add columns, change categories, adjust formulas to fit your style.' },
      ],
      previewType: 'journal',
    };
  }

  if (h.includes('position-sizing') || h.includes('calculator')) {
    return {
      badge: 'Google Sheets Tool', badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
      billingLabel: 'one-time',
      ctaLabel: 'Download the Calculator — $39',
      features: [
        'Auto position size from account & risk %',
        'Max daily loss & drawdown tracker',
        'Options contract sizing calculator',
        'Stocks, futures, forex & crypto modes',
        'Side-by-side scenario comparison',
        'Risk/reward ratio calculator',
        'Instant access after purchase',
        'Free updates for life',
      ],
      whatYouGet: [
        { heading: 'Instant Position Size Calculation', body: 'Enter your account size, the % you\'re willing to risk, and your stop loss distance — the calculator instantly tells you exactly how many shares or contracts to trade. No more guessing.' },
        { heading: 'Max Daily Loss Tracker', body: 'Set your daily loss limit and the calculator tracks it trade by trade. When you\'re close to your limit, it flags you — removing the temptation to keep trading through a bad day.' },
        { heading: 'Options Contract Sizing', body: 'Most position sizing tools ignore options. This one includes a dedicated section for calculating contract count based on premium paid, account risk %, and max loss per trade.' },
        { heading: 'Multi-Market Support', body: 'Separate calculation modes for stocks (shares), futures (contracts with point value), forex (pip value), and crypto (coins/tokens). Each mode auto-adjusts for the asset\'s unit structure.' },
        { heading: 'Scenario Comparison', body: 'Compare up to 4 position sizes side-by-side — different stop distances, different risk percentages — to find the sizing that balances your conviction with your risk rules.' },
      ],
      whoIsItFor: [
        'Traders who have ever sized into a position and regretted it',
        'Anyone who blows up their account on a single bad day',
        'Options traders who struggle with contract sizing',
        'Anyone transitioning to systematic, rule-based risk management',
      ],
      faq: [
        { q: 'Why not just use a free online calculator?', a: 'Online calculators give you one number and disappear. This tool tracks your daily loss in real time, compares scenarios, handles options, and keeps a history of every sizing decision — all in one place.' },
        { q: 'Does it work for futures?', a: 'Yes. Futures mode accounts for point value (e.g. $50/point for ES) so your contract count is always calibrated to actual dollar risk.' },
        { q: 'What if I trade multiple assets?', a: 'The calculator has separate tabs for each asset class — you can run stocks and futures calculations simultaneously without losing your inputs.' },
      ],
      previewType: 'calculator',
    };
  }

  if (h.includes('price-action')) {
    return {
      badge: '58-Page PDF Guide', badgeColor: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
      billingLabel: 'one-time',
      ctaLabel: 'Download the Guide — $47',
      features: [
        '20+ chart patterns with real examples',
        'Entry trigger rules for every setup',
        'Stop loss & take profit placement',
        'Support & resistance identification',
        'Multi-timeframe confirmation system',
        'Common false breakout traps',
        '58-page PDF, instant download',
        'Lifetime access & free updates',
      ],
      whatYouGet: [
        { heading: '20+ Proven Chart Patterns', body: 'Every major setup used by professional day traders — flags, pennants, wedges, double tops/bottoms, head and shoulders, inside bars, and more. Each pattern includes a real chart example, the psychology behind it, and exact entry criteria.' },
        { heading: 'Entry Trigger Rules', body: 'Not just "buy the breakout" — specific trigger rules for each pattern. When to enter on the break. When to wait for a retest. When to skip the trade entirely. Rules you can follow without second-guessing.' },
        { heading: 'Stop Loss & Target Placement', body: 'Where to put your stop on every pattern type — and why. Target placement using measured moves, key levels, and R:R minimums. The section most PDF guides skip entirely.' },
        { heading: 'Support & Resistance Methods', body: 'Three methods for identifying key levels: prior highs/lows, volume-based levels, and round-number confluence. Ranked by reliability and how to combine them for high-conviction entries.' },
        { heading: 'Multi-Timeframe Confirmation', body: 'How to use higher timeframe context to filter out low-quality setups on your entry timeframe. The exact process used by experienced traders to avoid trading against the trend.' },
      ],
      whoIsItFor: [
        'Traders who lose money on breakouts that immediately reverse',
        'Anyone who struggles to identify high-probability setups',
        'New traders building their first consistent strategy',
        'Experienced traders wanting a systematic pattern reference',
      ],
      faq: [
        { q: 'Is this for day trading or swing trading?', a: 'Both. The patterns work across timeframes — the guide covers how to apply each setup on 1m, 5m, 15m (day trading) and daily/weekly charts (swing trading).' },
        { q: 'What markets does it cover?', a: 'Stocks, futures, and crypto. All examples use real charts. The setups work on any liquid market.' },
        { q: 'Is this beginner-friendly?', a: 'Yes. The guide starts from first principles and builds progressively. No assumed knowledge — each concept is explained before being applied.' },
      ],
      previewType: 'guide',
    };
  }

  if (h.includes('gap')) {
    return {
      badge: '42-Page PDF Playbook', badgeColor: 'text-pink-400 border-pink-500/30 bg-pink-500/10',
      billingLabel: 'one-time',
      ctaLabel: 'Download the Playbook — $57',
      features: [
        'Pre-market gap scanning criteria',
        'Which gaps are worth trading (filter)',
        'Exact entry triggers — 1st 5 & 15 min',
        'Stop placement & trailing techniques',
        'Position sizing for gap trades',
        'Annotated real trade examples',
        'Common gap traps & how to avoid them',
        '42-page PDF, instant download',
      ],
      whatYouGet: [
        { heading: 'Pre-Market Gap Scanning Criteria', body: 'Exactly what to look for before the open — gap size thresholds, float requirements, volume criteria, and news catalysts. A step-by-step pre-market routine that takes under 10 minutes and surfaces the best gap candidates each morning.' },
        { heading: 'Gap Filtering System', body: 'Not every gap is worth trading. The playbook gives you a scoring system to quickly filter out low-quality gaps (overnight drift, earnings gaps on weak charts, low-float traps) and focus only on high-probability continuation plays.' },
        { heading: 'Exact Entry Triggers', body: 'The most important section. Specific entry rules for the first 5-minute candle, the first 15-minute candle, and VWAP reclaim entries — including what invalidates each setup and when to step aside entirely.' },
        { heading: 'Real Trade Examples', body: '12 annotated real trades — 8 winners and 4 losers — showing exactly why each was taken, where the entry and stop were placed, and what happened. The losers are explained in as much detail as the winners.' },
        { heading: 'Gap Traps & How to Avoid Them', body: 'The specific patterns that consistently fool new gap traders: the fake breakout open, the gap and crap, the early morning spike and flush. Learn to recognise them before they cost you money.' },
      ],
      whoIsItFor: [
        'Day traders focused on the first 30-60 minutes of the session',
        'Momentum traders looking for a repeatable morning strategy',
        'Anyone who has lost money chasing gaps without a system',
        'Traders who want a single strategy to master before adding complexity',
      ],
      faq: [
        { q: 'Do I need a scanner to use this?', a: 'A basic pre-market scanner (Finviz free, TradingView, or your broker\'s scanner) is enough. The playbook shows you exactly what filters to set.' },
        { q: 'Does this work for stocks, futures, or crypto?', a: 'Primarily stocks — the gap and go is most reliable and most traded in equities, especially small and mid caps with catalyst news. Futures application is discussed as a secondary section.' },
        { q: 'What if gaps don\'t happen every day?', a: 'They do — on average 30-50 stocks gap up more than 5% on volume every trading day. The playbook shows you how to find them and which ones meet criteria.' },
      ],
      previewType: 'guide',
    };
  }

  if (h.includes('masterclass') || h.includes('psychology')) {
    return {
      badge: 'Video Course', badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      billingLabel: 'one-time',
      ctaLabel: 'Enroll in the Masterclass — $297',
      features: [
        '12 in-depth video modules',
        'FOMO, revenge trading & overtrading',
        'Building and following a trade plan',
        'Emotional control techniques',
        'Post-loss recovery framework',
        'Identifying your personal edge killers',
        'Lifetime access + future updates',
        'Workbook and exercises included',
      ],
      whatYouGet: [
        { heading: '12 Video Modules', body: 'A complete curriculum covering every major psychology challenge traders face. Each module is focused, practical, and ends with a specific exercise or framework to apply immediately.' },
        { heading: 'FOMO & Revenge Trading', body: 'The two behaviors that destroy more trading accounts than bad analysis ever will. Detailed modules on why they happen, how to recognize them in real time, and the specific techniques to interrupt the pattern before you act.' },
        { heading: 'Building a Trade Plan That Sticks', body: 'Most traders have a trade plan on paper but abandon it under pressure. This module covers the psychology of plan adherence — why traders deviate and how to design a plan that you actually follow when money is on the line.' },
        { heading: 'Emotional Control in the Moment', body: 'Practical, evidence-backed techniques for managing fear, greed, and frustration during live trading sessions. Not theory — exercises you can do at your desk in 60 seconds.' },
        { heading: 'Post-Loss Recovery', body: 'A structured framework for what to do after a big loss or a losing streak — how to assess without self-blame, what to fix, and how to rebuild confidence methodically rather than impulsively.' },
      ],
      whoIsItFor: [
        'Traders who have solid technical analysis skills but consistently lose money',
        'Anyone who trades well in simulation but falls apart with real money',
        'Traders recovering from a major loss or drawdown',
        'Anyone who knows what they should do but can\'t make themselves do it',
      ],
      faq: [
        { q: 'Is this course comparable to Warrior Trading\'s psychology content?', a: 'Warrior Trading\'s Pro course is $2,997 and mixes strategy with psychology across hundreds of hours. This masterclass focuses entirely on psychology and discipline — the #1 reason traders fail — for $297.' },
        { q: 'How long is the course?', a: 'Approximately 6 hours of video content across 12 modules. Designed to be completed over 2-3 weeks with one module per session.' },
        { q: 'Do I need trading experience?', a: 'Basic trading experience recommended — you should understand what a trade is and have attempted live trading. This is not a "how to trade" course — it\'s a "how to trade consistently" course.' },
      ],
      previewType: 'guide',
    };
  }

  if (h.includes('playbook') || h.includes('risk-management')) {
    return {
      badge: 'PDF Playbook', badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      billingLabel: 'one-time',
      ctaLabel: 'Download the Playbook — $67',
      features: [
        'Position sizing formulas explained',
        'Stop loss placement strategies',
        'Max drawdown rules & thresholds',
        'Risk/reward framework (minimum R setups)',
        'Daily & weekly loss limit system',
        'Account recovery after drawdowns',
        'Instant PDF download',
        'Lifetime access',
      ],
      whatYouGet: [
        { heading: 'Position Sizing from First Principles', body: 'The exact formula for calculating position size based on account balance and risk per trade — with worked examples for stocks, options, futures, and crypto. Never size by gut feel again.' },
        { heading: 'Stop Loss Placement System', body: 'Where to put stops based on chart structure, not arbitrary dollar amounts. ATR-based stops, structure-based stops, and the maximum loss stop — and which to use in which situation.' },
        { heading: 'Max Drawdown Rules', body: 'The daily, weekly, and monthly loss limits used by professional prop traders — and how to adapt them to your account size. Includes a drawdown response protocol: what to do when you hit each threshold.' },
        { heading: 'Risk/Reward Framework', body: 'How to filter trades using minimum R:R requirements. Which setups deserve 1:1, which require 2:1, and how to calculate expected value across a sample of trades to know if a setup is worth taking.' },
        { heading: 'Account Recovery Protocol', body: 'A step-by-step plan for what to do after a significant drawdown — how to reduce size, rebuild confidence, and return to full trading without repeating the mistakes that caused the drawdown.' },
      ],
      whoIsItFor: [
        'Traders who know risk management matters but have never formalized their rules',
        'Anyone who has blown a trading account or come close',
        'New traders building a systematic approach from the start',
        'Traders transitioning from random sizing to consistent risk management',
      ],
      faq: [
        { q: 'Is this just a calculator guide?', a: 'No. The playbook covers the full risk management system — the math, the rules, the psychology of following rules, and the recovery process when things go wrong.' },
        { q: 'Does it cover options risk?', a: 'Yes. A dedicated section covers options-specific risk considerations: max loss on long options, assignment risk on short options, and how to size options positions correctly.' },
      ],
      previewType: 'guide',
    };
  }

  if (h.includes('bundle') || h.includes('toolkit') || h.includes('complete-trader')) {
    return {
      badge: 'Bundle — Best Value', badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      billingLabel: 'one-time',
      ctaLabel: 'Get the Complete Toolkit — $99',
      features: [
        'Day Trading Journal (Google Sheets)',
        'Position Sizing Calculator (Google Sheets)',
        'Price Action Setup Guide (58-page PDF)',
        'Gap & Go Strategy Playbook (42-page PDF)',
        'Save $73 vs buying separately ($172 value)',
        'Instant download, all 4 products',
        'Lifetime access to all future updates',
      ],
      whatYouGet: [
        { heading: 'Day Trading Journal', body: 'The Google Sheets trade journal used by thousands of active traders. Automatic P&L tracking, win rate and R:R dashboards, emotional state logging, and a strategy tag system to find your real edge.' },
        { heading: 'Position Sizing Calculator', body: 'Enter your account size, risk %, and stop distance — get the exact share/contract count in seconds. Includes options sizing, futures point-value mode, and a daily loss tracker.' },
        { heading: 'Price Action Setup Guide', body: 'A 58-page visual guide to 20+ chart patterns — with entry rules, stop placement, targets, and multi-timeframe confirmation. The reference guide active traders keep open on a second monitor.' },
        { heading: 'Gap & Go Strategy Playbook', body: 'The complete morning gap trading system. Pre-market scanning criteria, gap filtering, exact entry triggers for the open, 12 annotated real trade examples, and the most common gap traps to avoid.' },
      ],
      whoIsItFor: [
        'Traders who want a complete professional toolkit in one purchase',
        'Anyone building a systematic, rule-based trading process from scratch',
        'Traders who want to journal, size correctly, and trade high-probability setups',
        'The best value entry point into structured day trading',
      ],
      faq: [
        { q: 'Do I get all 4 products immediately?', a: 'Yes. After purchase, all four download links are instantly available from your account.' },
        { q: 'Are these the same products sold separately?', a: 'Exactly the same — the Journal ($29), Calculator ($39), Price Action Guide ($47), and Gap & Go Playbook ($57) — bundled at $99 instead of $172.' },
        { q: 'Do I get updates for all four?', a: 'Yes. All future updates to all four products are included with your one-time purchase.' },
      ],
      previewType: 'bundle',
    };
  }

  // ── eBooks ───────────────────────────────────────────────────────────────

  if (h.includes('stop-revenge-trading')) {
    return {
      badge: 'eBook', badgeColor: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
      billingLabel: 'one-time',
      ctaLabel: 'Download Now — Instant Access',
      features: [
        '30-day structured discipline reset',
        'Identify & break revenge trading triggers',
        'Daily mindset check-in exercises',
        'Stop-the-spiral emergency action plan',
        '58-page PDF, instant download',
      ],
      whatYouGet: [
        { heading: '30-Day Reset Framework', body: 'A structured 30-day program that systematically breaks the revenge trading cycle. Each day has a specific focus — from identifying triggers to rebuilding your trade plan with discipline rules baked in.' },
        { heading: 'Trigger Identification System', body: 'Learn to identify your personal revenge trading triggers before they fire. Includes a self-assessment worksheet and a "cooling off" protocol for after a losing trade.' },
        { heading: 'Daily Check-In Exercises', body: 'Short, focused exercises to start and end each trading day. Takes 5 minutes but compounds over time — traders who journal consistently are 2x more profitable than those who don\'t.' },
        { heading: 'Emergency Action Plan', body: 'A printed card-sized protocol for the exact moment you feel the urge to revenge trade. Tested by hundreds of traders to break the spiral in real time.' },
      ],
      whoIsItFor: [
        'Traders who have blown an account from revenge trading',
        'Anyone who struggles to stop trading after a big loss',
        'Traders who know their rules but break them anyway',
        'Anyone ready to turn discipline into a habit',
      ],
      faq: [
        { q: 'Is this a digital download?', a: 'Yes — instant PDF download. You\'ll receive access immediately after purchase.' },
        { q: 'Do I need trading experience?', a: 'No — this book works for beginners and experienced traders alike. The discipline issues it addresses are universal.' },
        { q: 'What if it doesn\'t work for me?', a: '30-day money-back guarantee, no questions asked.' },
      ],
      previewType: 'guide',
    };
  }

  if (h.includes('options-trading-beginners')) {
    return {
      badge: 'eBook', badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
      billingLabel: 'one-time',
      ctaLabel: 'Download Now — Instant Access',
      features: [
        'Calls, puts & spreads explained simply',
        'How to read an options chain',
        'Buying vs selling options — key differences',
        'Risk management on every options trade',
        '72-page PDF, instant download',
      ],
      whatYouGet: [
        { heading: 'Options Fundamentals', body: 'Calls, puts, strike prices, expiration dates, and premiums — explained with real examples, not textbook theory. By page 20 you\'ll understand what most beginners spend months figuring out.' },
        { heading: 'Reading the Chain', body: 'How to interpret an options chain, understand the Greeks (delta, theta, vega), and identify which contracts give you the best risk/reward for your trade idea.' },
        { heading: 'Buying vs Selling Options', body: 'Most beginners only buy options (and lose to theta decay). This section explains when to buy calls/puts, when to sell covered calls, and how to think like the professionals.' },
        { heading: 'Risk Management', body: 'Options can expire worthless — position sizing and stop rules are critical. This chapter walks through exactly how to size options positions and when to cut.' },
      ],
      whoIsItFor: [
        'Stock traders curious about options for the first time',
        'Anyone who\'s been confused by options chain screenshots',
        'Traders who want to hedge positions or generate income',
        'Anyone tired of overpaying for options courses',
      ],
      faq: [
        { q: 'Do I need to know stocks first?', a: 'Basic stock market knowledge helps, but the book starts from scratch. If you know what a stock is, you\'re ready.' },
        { q: 'Is this for US markets only?', a: 'The concepts apply globally, though examples use US exchanges (Nasdaq, CBOE).' },
        { q: 'Is there a money-back guarantee?', a: 'Yes — 30 days, no questions asked.' },
      ],
      previewType: 'guide',
    };
  }

  if (h.includes('profitable-traders-habits')) {
    return {
      badge: 'eBook', badgeColor: 'text-green-400 border-green-500/30 bg-green-500/10',
      billingLabel: 'one-time',
      ctaLabel: 'Download Now — Instant Access',
      features: [
        '7 science-backed trading habits',
        'Daily routines of consistently profitable traders',
        'How to eliminate emotional decisions',
        'Building a bulletproof trade plan',
        '64-page PDF, instant download',
      ],
      whatYouGet: [
        { heading: '7 Habits Framework', body: 'Each habit is backed by behavioral research and illustrated with real trading examples. From pre-market routines to post-session reviews — these are the behaviors that separate 10% traders from the rest.' },
        { heading: 'Daily Routine Templates', body: 'Morning, intraday, and end-of-day routines you can implement immediately. Includes a printable daily checklist so you never skip a step, even on stressful trading days.' },
        { heading: 'Decision Elimination System', body: 'The best traders make fewer decisions, not more. This section teaches you to pre-define your rules so that in-the-moment emotions can\'t override your plan.' },
        { heading: 'Trade Plan Builder', body: 'A step-by-step template to build your personal trade plan — covering setups, entry criteria, risk rules, max loss limits, and daily review process.' },
      ],
      whoIsItFor: [
        'Traders who are inconsistent despite knowing their strategy',
        'Anyone who has profitable weeks followed by blow-up weeks',
        'Traders who want to systematize their approach',
        'Anyone looking to build the habits of a professional trader',
      ],
      faq: [
        { q: 'Are these habits for day traders or swing traders?', a: 'Both. The habits are universal — whether you hold for minutes or weeks, these behavioral patterns apply.' },
        { q: 'How quickly can I see results?', a: 'Many traders report measurable improvement within the first 2 weeks of applying even 2-3 of the habits consistently.' },
        { q: 'Is there a guarantee?', a: '30-day money-back guarantee, no questions asked.' },
      ],
      previewType: 'guide',
    };
  }

  if (h.includes('crypto-beginners')) {
    return {
      badge: 'eBook', badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      billingLabel: 'one-time',
      ctaLabel: 'Download Now — Instant Access',
      features: [
        'Buy, trade & store crypto safely',
        'Wallets, exchanges & security',
        'Crypto trading fundamentals',
        'Portfolio & risk management basics',
        '68-page PDF, instant download',
      ],
      whatYouGet: [
        { heading: 'Crypto Fundamentals', body: 'Bitcoin, Ethereum, altcoins, DeFi, NFTs — what actually matters vs hype. Cuts through the noise to explain what crypto is, how it works, and why people trade it.' },
        { heading: 'Buying & Storing Safely', body: 'Step-by-step guide to setting up a wallet, choosing an exchange, and securing your assets. Covers the biggest mistakes beginners make (like leaving coins on exchanges).' },
        { heading: 'Trading Crypto', body: 'Spot vs futures, long vs short, leverage — explained in plain English. Includes a risk framework specifically designed for crypto\'s volatility.' },
        { heading: 'Portfolio Basics', body: 'How to think about allocation across crypto assets, position sizing given crypto\'s volatility, and when (and when not) to use stop losses in 24/7 markets.' },
      ],
      whoIsItFor: [
        'Complete crypto beginners who want to start right',
        'Stock traders considering adding crypto to their portfolio',
        'Anyone who has lost money in crypto and wants to understand why',
        'Anyone tired of vague YouTube videos about crypto',
      ],
      faq: [
        { q: 'Is this up to date?', a: 'Yes — written in 2025, covering current exchanges, wallets, and regulations. We update for major market changes.' },
        { q: 'Do I need technical knowledge?', a: 'Zero technical knowledge required. If you can use a smartphone app, you can follow this guide.' },
        { q: 'Is there a money-back guarantee?', a: 'Yes — 30 days, no questions asked.' },
      ],
      previewType: 'guide',
    };
  }

  if (h.includes('5am-trader')) {
    return {
      badge: 'eBook', badgeColor: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
      billingLabel: 'one-time',
      ctaLabel: 'Download Now — Instant Access',
      features: [
        '5AM pre-market research routine',
        'Gap scan & watchlist building process',
        'Mental preparation before market open',
        'Trade plan template for every session',
        '54-page PDF, instant download',
      ],
      whatYouGet: [
        { heading: 'The 5AM Routine', body: 'A minute-by-minute morning routine from 5AM to market open. Covers what to scan, what to read, what to skip — so you arrive at 9:30 with a clear plan, not scrambling for ideas.' },
        { heading: 'Pre-Market Gap Scan', body: 'How to identify the 2-3 stocks worth watching each morning. Includes specific scan criteria, news filters, and a scoring system to rank your watchlist by trade potential.' },
        { heading: 'Mental Preparation Protocol', body: 'The psychological component of morning prep that most traders ignore. Visualization techniques, breathing exercises, and a 5-minute mindset check-in used by professional traders.' },
        { heading: 'Daily Trade Plan Template', body: 'A fillable trade plan template for every session — covering your watchlist, entry criteria, max loss for the day, and personal rules to enforce. Included as a printable PDF.' },
      ],
      whoIsItFor: [
        'Day traders who feel unprepared when the market opens',
        'Traders who take impulsive trades without a plan',
        'Anyone who wants to build a structured pre-market routine',
        'Morning-focused traders who want to maximize the first hour',
      ],
      faq: [
        { q: 'Do I really need to wake up at 5AM?', a: 'The 5AM time is for US market open at 9:30 EST. Adjust to your timezone — the routine works whenever pre-market starts in your region.' },
        { q: 'Does this work for all markets?', a: 'The routine is designed for US equities and can be adapted for crypto (24/7) or forex. The principles are universal.' },
        { q: 'Is there a guarantee?', a: '30-day money-back guarantee, no questions asked.' },
      ],
      previewType: 'guide',
    };
  }

  // fallback
  return {
    badge: 'Alpha Flow', badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    billingLabel: '',
    ctaLabel: 'Get Access',
    features: [],
    whatYouGet: [],
    whoIsItFor: [],
    faq: [],
    previewType: 'signals',
  };
}

// ── Preview panels ────────────────────────────────────────────────────────────

function SignalsPreview() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500">
          <svg className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-100">Live Signal Dashboard</p>
          <p className="text-xs text-zinc-500">Updates every 20 seconds</p>
        </div>
        <span className="ml-auto flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-xs font-semibold text-green-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" /> Live
        </span>
      </div>
      <div className="space-y-2.5">
        {[
          { pair: 'BTC/USD', signal: 'LONG', confidence: 87, rsi: 31, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
          { pair: 'NVDA', signal: 'LONG', confidence: 82, rsi: 42, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
          { pair: 'ETH/USD', signal: 'HOLD', confidence: 55, rsi: 52, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
          { pair: 'SPY', signal: 'SHORT', confidence: 74, rsi: 69, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
        ].map(({ pair, signal, confidence, rsi, color, bg }) => (
          <div key={pair} className={`flex items-center justify-between rounded-lg border px-3 py-2.5 ${bg}`}>
            <div>
              <p className="text-sm font-semibold text-zinc-100">{pair}</p>
              <p className="text-xs text-zinc-500">RSI {rsi}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-bold ${color}`}>{signal}</span>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-14 overflow-hidden rounded-full bg-zinc-700">
                  <div className={`h-full rounded-full ${signal === 'SHORT' ? 'bg-red-400' : signal === 'HOLD' ? 'bg-yellow-400' : 'bg-green-400'}`} style={{ width: `${confidence}%` }} />
                </div>
                <span className="text-xs text-zinc-500">{confidence}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-zinc-600">Simulated preview · Not financial advice</p>
    </div>
  );
}

function JournalPreview() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <p className="mb-4 text-sm font-semibold text-zinc-300">Trading Journal — This Week</p>
      <div className="mb-4 grid grid-cols-3 gap-3">
        {[
          { label: 'Win Rate', value: '64%', color: 'text-green-400' },
          { label: 'Avg R:R', value: '1.8:1', color: 'text-cyan-400' },
          { label: 'Net P&L', value: '+$842', color: 'text-green-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl bg-zinc-800/60 p-3 text-center">
            <p className={`text-lg font-bold ${color}`}>{value}</p>
            <p className="text-xs text-zinc-500">{label}</p>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {[
          { date: 'Mon', setup: 'Gap & Go', result: '+$310', win: true },
          { date: 'Mon', setup: 'Breakout', result: '-$120', win: false },
          { date: 'Tue', setup: 'Reversal', result: '+$224', win: true },
          { date: 'Wed', setup: 'Gap & Go', result: '+$408', win: true },
          { date: 'Thu', setup: 'FOMO trade', result: '-$180', win: false },
        ].map((t, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg bg-zinc-800/40 px-3 py-2">
            <span className="w-10 text-xs text-zinc-500">{t.date}</span>
            <span className="flex-1 text-xs text-zinc-300">{t.setup}</span>
            <span className={`text-xs font-semibold ${t.win ? 'text-green-400' : 'text-red-400'}`}>{t.result}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CalculatorPreview() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <p className="mb-4 text-sm font-semibold text-zinc-300">Position Sizing Calculator</p>
      <div className="space-y-3">
        {[
          { label: 'Account Size', value: '$25,000' },
          { label: 'Risk Per Trade', value: '1%  →  $250' },
          { label: 'Stop Loss Distance', value: '$0.45 / share' },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between rounded-lg bg-zinc-800/60 px-3 py-2.5">
            <span className="text-xs text-zinc-400">{label}</span>
            <span className="text-sm font-semibold text-zinc-100">{value}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-center">
        <p className="text-xs text-zinc-400 mb-1">Shares to Buy</p>
        <p className="text-4xl font-extrabold text-cyan-400">555</p>
        <p className="text-xs text-zinc-500 mt-1">Max loss: $249.75</p>
      </div>
      <div className="mt-3 flex items-center justify-between rounded-lg bg-zinc-800/40 px-3 py-2">
        <span className="text-xs text-zinc-500">Daily loss used</span>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-zinc-700">
            <div className="h-full w-2/5 rounded-full bg-amber-400" />
          </div>
          <span className="text-xs text-amber-400">40%</span>
        </div>
      </div>
    </div>
  );
}

function GuidePreview() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <p className="mb-4 text-sm font-semibold text-zinc-300">What&apos;s Inside</p>
      <div className="space-y-3">
        {[
          { num: '01', title: 'Setup Identification', desc: 'Pattern recognition criteria' },
          { num: '02', title: 'Entry Triggers', desc: 'Exact rules — no guesswork' },
          { num: '03', title: 'Stop Placement', desc: 'Structure-based, not arbitrary' },
          { num: '04', title: 'Target & Exit', desc: 'Measured moves & R:R rules' },
          { num: '05', title: 'Real Examples', desc: 'Annotated trade charts' },
          { num: '06', title: 'Common Traps', desc: 'What to avoid & why' },
        ].map(({ num, title, desc }) => (
          <div key={num} className="flex items-center gap-3 rounded-lg bg-zinc-800/40 px-3 py-2.5">
            <span className="text-xs font-mono font-bold text-zinc-600">{num}</span>
            <div>
              <p className="text-sm font-medium text-zinc-200">{title}</p>
              <p className="text-xs text-zinc-500">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BundlePreview() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <p className="mb-4 text-sm font-semibold text-zinc-300">Everything Included</p>
      <div className="space-y-3">
        {[
          { name: 'Day Trading Journal', type: 'Google Sheets', price: '$29', color: 'bg-green-500/20 text-green-400' },
          { name: 'Position Sizing Calculator', type: 'Google Sheets', price: '$39', color: 'bg-blue-500/20 text-blue-400' },
          { name: 'Price Action Setup Guide', type: '58-page PDF', price: '$47', color: 'bg-orange-500/20 text-orange-400' },
          { name: 'Gap & Go Playbook', type: '42-page PDF', price: '$57', color: 'bg-pink-500/20 text-pink-400' },
        ].map(({ name, type, price, color }) => (
          <div key={name} className="flex items-center justify-between rounded-lg bg-zinc-800/40 px-3 py-2.5">
            <div>
              <p className="text-sm font-medium text-zinc-200">{name}</p>
              <p className="text-xs text-zinc-500">{type}</p>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${color}`}>{price}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
        <span className="text-sm font-semibold text-zinc-300">Bundle Price</span>
        <div className="text-right">
          <p className="text-xl font-extrabold text-amber-400">$99</p>
          <p className="text-xs text-zinc-500 line-through">$172</p>
        </div>
      </div>
    </div>
  );
}

const PREVIEW_MAP = {
  signals: SignalsPreview,
  journal: JournalPreview,
  calculator: CalculatorPreview,
  guide: GuidePreview,
  bundle: BundlePreview,
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ProductPage({ params }: Params) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) notFound();

  const variant = product.variants.edges[0]?.node;
  const price = variant?.price;
  const compareAt = variant?.compareAtPrice;
  const content = getProductContent(product.handle, product.title);
  const Preview = PREVIEW_MAP[content.previewType];

  const savings = compareAt && price
    ? Math.round(((parseFloat(compareAt.amount) - parseFloat(price.amount)) / parseFloat(compareAt.amount)) * 100)
    : null;

  const isFree = price && parseFloat(price.amount) === 0;

  return (
    <div className="min-h-screen bg-zinc-950 pt-24">
      <div className="mx-auto max-w-6xl px-6 py-12">

        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/store" className="hover:text-zinc-300 transition-colors">Store</Link>
          <span>/</span>
          <span className="text-zinc-400">{product.title}</span>
        </div>

        {/* Hero grid */}
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">

          {/* Left — info */}
          <div>
            {/* Badge row */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest ${content.badgeColor}`}>
                {content.badge}
              </span>
              {savings && (
                <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-400">
                  Save {savings}%
                </span>
              )}
            </div>

            <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-zinc-50 sm:text-4xl">
              {product.title}
            </h1>

            {product.description && (
              <p className="mb-6 text-base leading-relaxed text-zinc-400">
                {product.description}
              </p>
            )}

            {/* Price */}
            {price && (
              <div className="mb-6">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-extrabold tracking-tight text-zinc-50">
                    {isFree ? 'Free' : formatPrice(price.amount, price.currencyCode)}
                  </span>
                  {!isFree && content.billingLabel && (
                    <span className="mb-2 text-zinc-500">{content.billingLabel}</span>
                  )}
                </div>
                {compareAt && (
                  <p className="mt-1 text-sm text-zinc-500 line-through">
                    {formatPrice(compareAt.amount, compareAt.currencyCode)}
                  </p>
                )}
              </div>
            )}

            {/* Features */}
            {content.features.length > 0 && (
              <ul className="mb-8 space-y-2.5">
                {content.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-zinc-300">
                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            )}

            {/* CTA */}
            {variant && (
              <AddToCartButton
                merchandiseId={variant.id}
                label={content.ctaLabel}
                featured
                productTitle={product.title}
                price={price?.amount}
                currencyCode={price?.currencyCode}
                imageUrl={product.featuredImage?.url ?? null}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-4 text-base font-bold text-black transition-all hover:bg-cyan-400 active:scale-[0.99] disabled:opacity-60"
              />
            )}

            {/* Trust row */}
            <div className="mt-4 flex flex-wrap gap-3">
              {[
                { icon: '🔒', label: 'Secure checkout' },
                { icon: '↩️', label: '30-day guarantee' },
                { icon: '⚡', label: 'Instant access' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 rounded-lg bg-zinc-800/60 px-3 py-1.5 text-xs text-zinc-400">
                  <span>{icon}</span><span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — product image + preview */}
          <div className="space-y-6">
            {product.featuredImage && (
              <div className="overflow-hidden rounded-2xl border border-zinc-800">
                <Image
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText ?? product.title}
                  width={1200}
                  height={800}
                  className="w-full object-cover"
                  priority
                />
              </div>
            )}
            <Preview />
          </div>
        </div>

        {/* What you get */}
        {content.whatYouGet.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-8 text-2xl font-bold text-zinc-50">What You Get</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {content.whatYouGet.map(({ heading, body }) => (
                <div key={heading} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                  <h3 className="mb-2 font-bold text-zinc-100">{heading}</h3>
                  <p className="text-sm leading-relaxed text-zinc-400">{body}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Who it's for */}
        {content.whoIsItFor.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-bold text-zinc-50">Who This Is For</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {content.whoIsItFor.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900/30 px-4 py-3">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-sm text-zinc-300">{item}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        {content.faq.length > 0 && (
          <section className="mt-16 max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold text-zinc-50">Questions</h2>
            <div className="space-y-3">
              {content.faq.map(({ q, a }) => (
                <details key={q} className="group rounded-xl border border-zinc-800 bg-zinc-900/50 px-6 py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-zinc-200">
                    {q}
                    <svg className="h-4 w-4 flex-shrink-0 text-zinc-500 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">{a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        {variant && (
          <div className="mt-16 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 text-center">
            <h2 className="mb-2 text-xl font-bold text-zinc-50">Ready to get started?</h2>
            <p className="mb-6 text-sm text-zinc-400">
              {isFree ? 'No credit card required.' : '30-day money-back guarantee. Instant access.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <AddToCartButton
                merchandiseId={variant.id}
                label={content.ctaLabel}
                featured
                productTitle={product.title}
                price={price?.amount}
                currencyCode={price?.currencyCode}
                imageUrl={product.featuredImage?.url ?? null}
                className="rounded-xl bg-cyan-500 px-8 py-3.5 text-sm font-bold text-black transition-colors hover:bg-cyan-400 disabled:opacity-60"
              />
              <Link href="/store" className="rounded-xl border border-zinc-700 px-6 py-3.5 text-sm font-semibold text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-50">
                Browse all products
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
