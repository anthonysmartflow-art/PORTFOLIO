import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://anthonyrosenberger.com'),
  title: 'Anthony Rosenberger | Website Design & Development',
  description:
    'Anthony Rosenberger designs and develops modern websites for nonprofits and small businesses.',
  openGraph: {
    title: 'Anthony Rosenberger | Website Design & Development',
    description: 'Modern, responsive websites for nonprofits and small businesses.',
    type: 'website',
    url: '/',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Anthony Rosenberger — website design and development for nonprofits and small businesses',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anthony Rosenberger | Website Design & Development',
    description: 'Modern, responsive websites for nonprofits and small businesses.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
