import type { Metadata } from 'next';
import './globals.css';

const siteUrl = 'https://typerace.sreekarreddy.com'; 

// JSON-LD structured data
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': `${siteUrl}/#app`,
      name: 'SR TypeRace',
      description: 'A retro terminal-themed typing speed game with practice mode, computer opponents, and real-time P2P multiplayer racing.',
      url: siteUrl,
      applicationCategory: 'Game',
      operatingSystem: 'Web Browser',
      browserRequirements: 'Requires JavaScript',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      author: {
        '@type': 'Person',
        name: 'Sreekar Reddy',
        url: 'https://sreekarreddy.com',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '50',
      },
    },
    {
      '@type': 'Person',
      '@id': 'https://sreekarreddy.com/#person',
      name: 'Sreekar Reddy',
      alternateName: 'Sreekar Reddy Edulapalli',
      url: 'https://sreekarreddy.com',
      sameAs: [
        'https://github.com/esreekarreddy',
        'https://linkedin.com/in/esreekarreddy',
        'https://twitter.com/esreekarreddy',
      ],
    },
    {
      '@type': 'WebPage',
      '@id': `${siteUrl}/#webpage`,
      url: siteUrl,
      name: 'SR TypeRace - Terminal Typing Speed Game',
      description: 'Race against the clock, AI opponents, or friends in this retro terminal-themed typing game.',
      isPartOf: { '@id': `${siteUrl}/#app` },
      about: { '@id': 'https://sreekarreddy.com/#person' },
      inLanguage: 'en-AU',
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SR TypeRace | Terminal Typing Speed Game',
    template: '%s | SR TypeRace',
  },
  description:
    'Race against the clock, AI opponents, or friends in this retro terminal-themed typing speed game. Improve your WPM with practice mode, code snippets, and real-time P2P multiplayer.',
  keywords: [
    'typing speed test',
    'typing game',
    'WPM test',
    'keyboard practice',
    'typing race',
    'multiplayer typing',
    'code typing',
    'terminal game',
    'retro game',
    'Sreekar Reddy',
    'Sreekar Reddy Edulapalli',
    'Sreekar Reddy Portfolio',
    'Sreekar Reddy Projects',
  ],
  authors: [{ name: 'Sreekar Reddy', url: 'https://sreekarreddy.com' }],
  creator: 'Sreekar Reddy',
  publisher: 'Sreekar Reddy',
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: siteUrl,
    siteName: 'SR TypeRace',
    title: 'SR TypeRace | Terminal Typing Speed Game',
    description: 'Race against the clock, AI opponents, or friends in this retro terminal-themed typing game.',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'SR TypeRace - Terminal Typing Speed Game',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SR TypeRace | Terminal Typing Speed Game',
    description: 'Race against the clock, AI opponents, or friends in this retro terminal-themed typing game.',
    creator: '@esreekarreddy',
    images: [`${siteUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'M2DsCJTIe9s1V0OR2mGrrr_xeaYWrwTLvJ622qwIt0M',
  },
  alternates: {
    canonical: siteUrl,
  },
  category: 'game',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#0d0d0d] antialiased">
        {/* Scanline effect */}
        <div className="scanlines" aria-hidden="true" />
        
        {children}
      </body>
    </html>
  );
}
