import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

// JSON-LD structured data for rich results
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "CommitVerse",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Web Browser",
      "description": "Transform any public GitHub repository into a stunning 3D visualization. Explore commits, branches, and contributors in an interactive helix timeline.",
      "url": "https://commitverse.sreekarreddy.com",
      "author": {
        "@type": "Person",
        "@id": "https://sreekarreddy.com/#person",
        "name": "Sreekar Reddy",
        "url": "https://sreekarreddy.com",
        "sameAs": [
          "https://linkedin.com/in/esreekarreddy",
          "https://github.com/esreekarreddy",
          "https://twitter.com/esreekarreddy"
        ]
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "3D helix timeline visualization",
        "Interactive commit exploration",
        "Branch and contributor analysis",
        "Real-time GitHub API integration",
        "Privacy-first - no data storage"
      ]
    },
    {
      "@type": "WebPage",
      "@id": "https://commitverse.sreekarreddy.com",
      "name": "CommitVerse by Sreekar Reddy",
      "description": "3D Git repository visualization tool.",
      "isPartOf": {
        "@type": "WebSite",
        "name": "Sreekar Reddy Projects",
        "url": "https://sreekarreddy.com"
      }
    }
  ]
};

export const metadata: Metadata = {
  metadataBase: new URL("https://commitverse.sreekarreddy.com"),
  title: {
    default: "CommitVerse by Sreekar Reddy | 3D Git Visualization",
    template: "%s | CommitVerse"
  },
  description: "CommitVerse by Sreekar Reddy - Transform any public GitHub repository into a stunning 3D visualization. Explore commits, branches, and contributors in an interactive helix timeline.",
  keywords: [
    "Sreekar Reddy",
    "Sreekar Reddy Edulapalli",
    "Sreekar Reddy Portfolio",
    "Sreekar Reddy Projects",
    "CommitVerse",
    "git visualization",
    "github visualization",
    "3D commits",
    "git graph",
    "repository explorer",
    "commit history",
    "branch visualization",
    "helix timeline",
    "react three fiber",
    "webgl",
    "open source",
    "developer tools",
    "github api"
  ],
  authors: [{ name: "Sreekar Reddy", url: "https://sreekarreddy.com" }],
  creator: "Sreekar Reddy",
  publisher: "Sreekar Reddy",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://commitverse.sreekarreddy.com",
    siteName: "CommitVerse by Sreekar Reddy",
    title: "CommitVerse by Sreekar Reddy | 3D Git Visualization",
    description: "Transform any GitHub repository into an interactive 3D visualization of commits, branches, and contributors.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CommitVerse - 3D Git Visualization by Sreekar Reddy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CommitVerse by Sreekar Reddy | 3D Git Visualization",
    description: "Explore GitHub repos as interactive 3D visualizations",
    images: ["/og-image.png"],
    creator: "@esreekarreddy",
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
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/icon.svg",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://commitverse.sreekarreddy.com",
  },
  verification: {
    google: "M2DsCJTIe9s1V0OR2mGrrr_xeaYWrwTLvJ622qwIt0M",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#6366f1" />
        <link rel="preconnect" href="https://api.github.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
