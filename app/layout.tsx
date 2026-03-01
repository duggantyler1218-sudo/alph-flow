import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/cart-provider';
import { Nav } from '@/components/nav';
import { CartDrawer } from '@/components/cart-drawer';
import { CoachProvider } from '@/components/coach-provider';
import { CoachDrawer, CoachFloatingButton } from '@/components/coach-drawer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alpha-flow.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: 'Alpha Flow — AI Trading Signals & Discipline Coach',
    template: '%s | Alpha Flow',
  },
  description:
    'Real-time AI trade signals, an AI trading assistant, and the only built-in discipline coach. Half the price of Warrior Trading and BlackBoxStocks. 30-day money-back guarantee.',
  keywords: [
    'AI trading signals', 'day trading tools', 'trading discipline coach',
    'stock market signals', 'day trading journal', 'position sizing calculator',
    'trading psychology', 'gap and go strategy', 'price action trading guide',
    'trading ebooks', 'algorithmic trading', 'crypto trading signals',
  ],
  openGraph: {
    type: 'website',
    siteName: 'Alpha Flow',
    title: 'Alpha Flow — AI Trading Signals & Discipline Coach',
    description: 'Real-time AI trade signals, AI trading assistant, and built-in discipline coach. Half the price of competitors.',
    url: BASE,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Alpha Flow — AI Trading Platform' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alpha Flow — AI Trading Signals & Discipline Coach',
    description: 'Real-time AI signals + discipline coach. Half the price of Warrior Trading & BlackBoxStocks.',
    images: ['/og.png'],
  },
  alternates: { canonical: BASE },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CartProvider>
          <CoachProvider>
            <Nav />
            <CartDrawer />
            <CoachDrawer />
            <CoachFloatingButton />
            {children}
          </CoachProvider>
        </CartProvider>
      </body>
    </html>
  );
}
