import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://devmarks.sreekarreddy.com";

// JSON-LD structured data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${siteUrl}/#app`,
      name: "SR DevMarks",
      description:
        "A beautiful bookmark manager for developers. Organize, tag, and search your technical bookmarks with a premium dashboard interface.",
      url: siteUrl,
      applicationCategory: "Productivity",
      operatingSystem: "Web Browser",
      browserRequirements: "Requires JavaScript",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      author: {
        "@type": "Person",
        name: "Sreekar Reddy",
        url: "https://sreekarreddy.com",
      },
      featureList: [
        "Tag-based organization",
        "Full-text search",
        "Import/Export JSON",
        "Favorites system",
        "Responsive design",
        "100% client-side storage",
      ],
    },
    {
      "@type": "Person",
      "@id": "https://sreekarreddy.com/#person",
      name: "Sreekar Reddy",
      alternateName: "Sreekar Reddy Edulapalli",
      url: "https://sreekarreddy.com",
      sameAs: [
        "https://github.com/esreekarreddy",
        "https://linkedin.com/in/esreekarreddy",
        "https://twitter.com/esreekarreddy",
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      url: siteUrl,
      name: "SR DevMarks - Developer Bookmark Manager",
      description:
        "Organize your developer bookmarks with tags, search, and a beautiful dashboard.",
      isPartOf: { "@id": `${siteUrl}/#app` },
      about: { "@id": "https://sreekarreddy.com/#person" },
      inLanguage: "en-AU",
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SR DevMarks | Developer Bookmark Manager",
    template: "%s | SR DevMarks",
  },
  description:
    "A beautiful bookmark manager for developers. Organize, tag, and search your technical bookmarks with a premium dashboard. 100% client-side, no account required.",
  keywords: [
    "bookmark manager",
    "developer bookmarks",
    "bookmark organizer",
    "tag bookmarks",
    "developer tools",
    "productivity",
    "bookmark search",
    "coding resources",
    "web bookmarks",
    "Sreekar Reddy",
    "Sreekar Reddy Edulapalli",
    "Sreekar Reddy Portfolio",
    "Sreekar Reddy Projects",
  ],
  authors: [{ name: "Sreekar Reddy", url: "https://sreekarreddy.com" }],
  creator: "Sreekar Reddy",
  publisher: "Sreekar Reddy",
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: siteUrl,
    siteName: "SR DevMarks",
    title: "SR DevMarks | Developer Bookmark Manager",
    description:
      "A beautiful bookmark manager for developers. Organize, tag, and search your technical bookmarks.",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "SR DevMarks - Developer Bookmark Manager",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SR DevMarks | Developer Bookmark Manager",
    description:
      "A beautiful bookmark manager for developers. Organize, tag, and search your technical bookmarks.",
    creator: "@esreekarreddy",
    images: [`${siteUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "M2DsCJTIe9s1V0OR2mGrrr_xeaYWrwTLvJ622qwIt0M",
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "productivity",
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
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
