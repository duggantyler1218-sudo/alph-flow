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

export const metadata: Metadata = {
  title: 'Alpha Flow — AI-Powered Trading Signals',
  description:
    'Institutional-grade AI trade signals, real-time multi-market analysis, and risk management for modern traders.',
  keywords: ['AI trading', 'trade signals', 'algorithmic trading', 'stock market AI'],
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
