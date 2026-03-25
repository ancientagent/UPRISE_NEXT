import type { Metadata } from 'next';
import { Caveat, Special_Elite } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const editorial = Special_Elite({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-editorial',
});

const handwritten = Caveat({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-handwritten',
});

export const metadata: Metadata = {
  title: 'UPRISE - Music Community Platform',
  description: 'Connect with local music communities, share tracks, and discover events',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${editorial.variable} ${handwritten.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
